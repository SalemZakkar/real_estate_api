import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { applyPsqlFilter, CASLPermission } from 'core';
import { PropertyStatus } from './entites/property.enum';
@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @Inject() private readonly fileService: FileService,
    @Inject() private readonly citySerivice: CityService,
  ) {}

  async create(
    property: PropertyCreateDto,
    owner: UUID,
    file: Express.Multer.File,
  ) {
    let data = omit(property, 'cityId');
    data.city = await this.citySerivice.findById(property.cityId);
    data.owner = { id: owner };
    return await this.fileService.executeFileTransaction({
      files: [file],
      folder: 'properties',
      handler: async (manager, files) => {
        data.cover = files.at(0);
        let p = await manager.save(Property, data);
        return await manager.findOneBy(Property, { id: p.id });
      },
    });
  }

  async edit(
    id: UUID,
    dto: PropertyEditDto,
    perm: CASLPermission,
    cover?: Express.Multer.File,
  ) {
    const property = await this.getById(id);

    if (!perm.entityCondition!(property)) {
      throw new ForbiddenException();
    }
    Object.entries(dto).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== 'cityId' &&
        key !== 'images' &&
        key !== 'status'
      ) {
        (property as any)[key] = value;
      }
    });

    if (dto.cityId) {
      property.city = await this.citySerivice.findById(dto.cityId);
    }
    if (!cover) {
      return await this.propertyRepository.save(property);
    } else {
      return await this.fileService.executeFileTransaction({
        deleteIds: [property.cover!.id],
        folder: 'properties',
        handler: async (handler, files) => {
          property.cover = files.at(0)!;
          return await handler.save(Property, property);
        },
      });
    }
  }

  async getById(id: UUID) {
    let res = await this.propertyRepository.findOneBy({ id: id });
    if (!res) {
      throw new NotFoundException('Property Not Found');
    }
    return res;
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
    if (prop.cover) {
      ids.push(prop.cover!.id);
    }
    await this.fileService.executeFileTransaction({
      deleteIds: ids,
      folder: 'properties',
      handler: async (manager, files) => {
        return await manager.delete(Property, { id: id });
      },
    });
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
    if (image) {
      if ((prop.images?.length || 0) >= 6) {
        throw new BadRequestException('Maximum Images is 6 got');
      }
      return await this.fileService.executeFileTransaction({
        files: [file],
        folder: 'properties',
        async handler(manager, files) {
          if (prop.images) {
            prop.images!.push(files.at(0)!);
          } else {
            prop.images = [files.at(0)!];
          }
          return await manager.save(Property, prop);
        },
      });
    } else {
      let remove = prop.video?.id ? [prop.video.id] : [];
      return await this.fileService.executeFileTransaction({
        deleteIds: remove,
        files: [file],
        folder: 'properties',
        handler: async (manager, files) => {
          prop.video = files.at(0);
          return await manager.save(Property, prop);
        },
      });
    }
  }

  async deleteFile(id: UUID, fileId: UUID, perm: CASLPermission) {
    let prop = await this.getById(id);
    if (!perm.entityCondition(prop)) {
      throw new ForbiddenException();
    }
    await this.fileService.deleteFiles([fileId]);
  }

  async find(data: PropertyGetDto, perm?: CASLPermission) {
    let qb = this.propertyRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.city', 'city')
      .leftJoinAndSelect('p.images', 'appfile')
      .leftJoinAndSelect('p.video', 'v')
      .leftJoinAndSelect('p.cover', 'cover')
      .leftJoinAndSelect('p.owner', 'user');

    if (perm?.dbQuery) {
      let [cond, vars] = perm.dbQuery;
      qb.andWhere(cond, vars);
    }
    if (data.price) {
      qb.addOrderBy('p.price', data.price);
    }
    if (data.size) {
      qb.addOrderBy('p.size', data.price);
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

  async getByMap(data: PropertyMapGetDto) {
    let qb = this.propertyRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.city', 'city')
      .leftJoinAndSelect('p.images', 'appfile')
      .leftJoinAndSelect('p.video', 'v')
      .leftJoinAndSelect('p.cover', 'cover')
      .leftJoinAndSelect('p.owner', 'user');
    qb.andWhere(
      `ST_DWithin(
          p.coordinates,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
          :radius
        )`,
      { lng: data.lng, lat: data.lat, radius: data.radius },
    );
    if (data.isFeature != undefined) {
      qb.andWhere('p.isFeature = :isFeature', { isFeature: data.isFeature });
    }
    return await qb.getMany();
  }
}
