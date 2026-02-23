import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Property } from './entity/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { PropertyCreateDto } from './dto/property-create.dto';
import { PropertyEditDto } from './dto/property-edit.dto';
import { UUID } from 'crypto';
import { omit } from 'lodash';
@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @Inject() private readonly fileService: FileService,
    private readonly ds: DataSource,
  ) {}

  create(property: PropertyCreateDto, owner: UUID) {
    return this.propertyRepository.save({ ...property, owner: { id: owner } });
  }
  async edit(id: UUID, dto: PropertyEditDto) {
    let property = await this.getById(id);
    if (dto.images) {
      property.images = await this.fileService.getManyByIds(dto.images);
    }
    let edit = omit(property, 'images');
    return this.propertyRepository.save({ ...property, ...edit });
  }

  async getById(id: UUID) {
    let res = await this.propertyRepository.findOneBy({ id: id });
    if (!res) {
      throw new NotFoundException('Property Not Found');
    }
    return res;
  }

  async delete(id: UUID) {
    let prop = await this.getById(id);
    await this.fileService.executeFileTransaction({
      deleteIds: prop.images ? prop.images!.map((e) => e.id)! : undefined,
      folder: 'properties',
      handler: async (manager, files) => {
        return await manager.delete(Property, { id: id });
      },
    });
  }

  async addImage(id: UUID, file: Express.Multer.File) {
    let prop = await this.getById(id);
    if ((prop.images?.length || 0) > 6) {
      throw new BadRequestException(
        'Maximum Images is 6 got ' + prop.images!.length,
      );
    }
    await this.fileService.executeFileTransaction({
      files: [file],
      folder: 'property',
      async handler(manager, files) {
        prop.images = [...(prop.images || []), files.at(0)!];
        return await manager.save(Property, prop);
      },
    });
  }

  async deleteImage(id: UUID, fileId: UUID) {
    let prop = await this.getById(id);
    if ((prop.images?.length || 0) <= 1) {
      throw new BadRequestException('Property must have at least one image');
    }
    await this.fileService.executeFileTransaction({
      deleteIds: [fileId],
      folder: 'property',
      async handler(manager, files) {
        prop.images = prop.images!.filter((e) => e.id != fileId);
        return await manager.save(Property, prop);
      },
    });
  }
}
