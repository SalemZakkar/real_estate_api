import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdBanner } from './entities/ad-banner.entity';
import { AdBannerDto } from './dto/ad-banner.dto';
import { FileService } from '../file/file.service';
@Injectable()
export class AdBannerSerivce {
  constructor(
    @InjectRepository(AdBanner) private readonly repo: Repository<AdBanner>,
    @Inject() private readonly fileService: FileService,
  ) {}

  async save(dto: AdBannerDto, file: Express.Multer.File) {
    return await this.fileService.executeFileTransaction({
      folder: 'adbanner',
      files: [file],
      handler: async (manager, files) => {
        let k = new AdBanner();
        k.url = dto.url;
        k.image = files.at(0)!;
        return await manager.save(AdBanner, k);
      },
    });
  }

  async getById(id: UUID) {
    let k = await this.repo.findOneBy({ id });
    if (!k) {
      throw new NotFoundException('');
    }
    return k;
  }

  async delete(id: UUID) {
    let k = await this.getById(id);
    await this.fileService.executeFileTransaction({
      deleteIds: [k.image.id],
      folder: 'adbanner',
      async handler(manager) {
        await manager.remove(k);
      },
    });
  }

  async edit(id: UUID, dto: AdBannerDto, file?: Express.Multer.File) {
    let k = await this.getById(id);
    k.url = dto.url;
    if (file) {
      return await this.fileService.executeFileTransaction({
        files: [file],
        deleteIds: k.image ? [k.image.id] : undefined,
        folder: 'adbanner',
        handler: async (manager, files) => {
          k.image = files.at(0)!;
          return await manager.save(AdBanner, k);
        },
      });
    } else {
      return await this.repo.save(k);
    }
  }

  async getAll() {
    return await this.repo.find();
  }
}
