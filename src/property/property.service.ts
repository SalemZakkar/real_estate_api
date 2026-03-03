import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Property } from './entites/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { PropertyCreateDto } from './dto/property-create.dto';
import { PropertyEditDto, PropertyStatusDto } from './dto/property-edit.dto';
import { UUID } from 'crypto';
import { omit } from 'lodash';
import { CityService } from '../city/city.service';
import { PropertyGetDto, PropertyMapGetDto } from './dto/property-get.dto';
import { applyPsqlFilter, CASLPermission, transaction } from 'core';
import { PropertyStatus } from './entites/property.enum';
import { AppFile } from '../file/entity/app-file.entity';
@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @Inject() private readonly fileService: FileService,
    @Inject() private readonly citySerivice: CityService,
  ) {}

  async create(property: PropertyCreateDto, owner: UUID) {
    let data = omit(property, 'cityId', 'lat', 'lng');
    data.city = await this.citySerivice.findById(property.cityId);
    data.owner = { id: owner };
    data.coordinates = {
      coordinates: [property.lng, property.lat],
      type: 'Point',
    };
    let res = await this.propertyRepository.manager.save(Property, data);
    return await this.propertyRepository.findOneBy({ id: res.id });
  }

  async edit(id: UUID, dto: PropertyEditDto, perm: CASLPermission) {
    const property = await this.getById(id);

    if (!perm.entityCondition!(property)) {
      throw new ForbiddenException();
    }
    Object.entries(dto).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== 'cityId' &&
        key !== 'images' &&
        key !== 'status' &&
        key !== 'lat' &&
        key !== 'lng' &&
        key !== 'cover'
      ) {
        (property as any)[key] = value;
      }
    });

    if (dto.cityId) {
      property.city = await this.citySerivice.findById(dto.cityId);
    }
    if (dto.lat && dto.lng) {
      property.coordinates = {
        coordinates: [dto.lng, dto.lat],
        type: 'Point',
      };
    }
    return await this.propertyRepository.save(property);
  }

  async changeStatus(id: UUID, data: PropertyStatusDto, perm: CASLPermission) {
    const prop = await this.getById(id);

    if (!perm.entityCondition(prop)) {
      throw new ForbiddenException();
    }

    const current = prop.status;
    const next = data.status;

    if (next === PropertyStatus.unCompleted) {
      throw new BadRequestException('Cannot revert to unCompleted');
    }

    switch (next) {
      case PropertyStatus.pending:
        if (current !== PropertyStatus.unCompleted) {
          throw new BadRequestException(
            'Pending requires previous status to be unCompleted',
          );
        }

        if (!prop.isCompleted) {
          throw new BadRequestException(
            'Property must be completed before pending',
          );
        }
        break;

      case PropertyStatus.active:
        if (
          current !== PropertyStatus.pending &&
          current !== PropertyStatus.unActivated
        ) {
          throw new BadRequestException(
            'Active requires Pending or unActivated',
          );
        }
        break;

      case PropertyStatus.unActivated:
        if (current !== PropertyStatus.active) {
          throw new BadRequestException('unActivated requires Active status');
        }
        break;

      case PropertyStatus.rejected:
        break;
    }

    prop.status = next;

    return this.propertyRepository.save(prop);
  }

  async addFile(
    id: UUID,
    file: Express.Multer.File,
    perm: CASLPermission,
    image: boolean,
  ) {
    let prop = await this.getById(id);
    if (!perm.entityCondition(prop)) {
      throw new ForbiddenException();
    }
    if (image && (prop.images?.length || 0) >= 6) {
      throw new BadRequestException('6 images at most');
    }
    if (!prop.images) {
      prop.images = [];
    }
    let oldVideo = prop.video;
    let fileId: UUID | null = null;
    return await transaction(
      this.propertyRepository.manager.connection,
      async (em) => {
        let pRepo = em.getRepository(Property);
        let pFile = em.getRepository(AppFile);
        let resFile = await this.fileService.store(file, 'property');
        fileId = resFile.id;
        await this.fileService.use(resFile.id, pFile);
        if (image) {
          prop.images!.push(resFile);
        } else {
          if (oldVideo) {
            await this.fileService.delete(oldVideo.id, pFile);
          }
          prop.video = resFile;
        }
        return await pRepo.save(prop);
      },
      {
        onDone: () => {
          if (oldVideo && !image) {
            this.fileService.cleanUp([oldVideo.id]);
          }
        },
        onError: () => {
          if (fileId) {
            this.fileService.cleanUp([fileId]);
          }
        },
      },
    );
  }

  async deleteFile(id: UUID, fileId: UUID, perm: CASLPermission) {
    let prop = await this.getById(id);
    if (!perm.entityCondition(prop)) {
      throw new ForbiddenException();
    }
    await this.fileService.delete(fileId);
    this.fileService.cleanUp([fileId]);
  }

  async delete(id: UUID, perm: CASLPermission) {
    let prop = await this.getById(id);
    if (!perm.entityCondition(prop)) {
      throw new ForbiddenException();
    }
    let ids: UUID[] = [];
    prop.images?.forEach((e) => ids.push(e.id));
    if (prop.video) {
      ids.push(prop.video!.id);
    }
    await transaction(
      this.propertyRepository.manager.connection,
      async (em) => {
        let pRepo = em.getRepository(Property);
        let pFile = em.getRepository(AppFile);
        for (const id of ids) {
          await this.fileService.delete(id, pFile);
        }
        await pRepo.remove(prop);
      },
      {
        onDone: () => {
          this.fileService.cleanUp(ids);
        },
      },
    );
  }

  async getByMap(data: PropertyMapGetDto) {
    let qb = this.propertyRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.city', 'city')
      .leftJoinAndSelect('p.images', 'appfile')
      .leftJoinAndSelect('p.video', 'v')
      .leftJoinAndSelect('p.owner', 'user')
      .where(
        `ST_Intersects(
          ST_MakeEnvelope(:west, :south, :east, :north, 4326)::geometry,
          p.coordinates
        )`,
        {
          west: data.west,
          south: data.south,
          east: data.east,
          north: data.north,
        },
      );
    if (data.isFeature != undefined) {
      qb.andWhere('p.isFeature = :isFeature', { isFeature: data.isFeature });
    }
    return await qb.getMany();
  }

  async find(data: PropertyGetDto, perm?: CASLPermission) {
    let qb = this.propertyRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.city', 'city')
      .leftJoinAndSelect('p.images', 'appfile')
      .leftJoinAndSelect('p.video', 'v')
      .leftJoinAndSelect('p.owner', 'user');

    // if (perm?.dbQuery) {
    //   let [cond, vars] = perm.dbQuery;
    //   qb.andWhere(cond, vars);
    // }
    if (data.price) {
      qb.addOrderBy('p.price', data.price);
    }
    if (data.size) {
      qb.addOrderBy('p.size', data.size);
    }
    applyPsqlFilter({
      queryBuilder: qb,
      query: data,
      options: {
        price: {
          skip: true,
        },
        size: {
          skip: true,
        },
        owner: {
          value: (v) => ['user.id = :id', { id: v }],
        },
        city: {
          value: (v) => ['city.id = :id', { id: v }],
        },
      },
    });
    let [list, count] = await qb.getManyAndCount();
    return { data: list, totalRecords: count };
  }

  async getById(id: UUID) {
    let res = await this.propertyRepository.findOneBy({ id: id });
    if (!res) {
      throw new NotFoundException('Property Not Found');
    }
    return res;
  }
}
