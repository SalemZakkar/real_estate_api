import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdBanner } from './entities/ad-banner.entity';
import { AdBannerDto } from './dto/ad-banner.dto';
import { FileService } from '../file/file.service';
import { transaction } from 'core';
import { AppFile } from '../file/entity/app-file.entity';
@Injectable()
export class AdBannerSerivce {
  constructor(
    @InjectRepository(AdBanner) private readonly repo: Repository<AdBanner>,
    @Inject() private readonly fileService: FileService,
  ) {}

  async save(dto: AdBannerDto, file: Express.Multer.File) {
    let newImage: AppFile;
    return await transaction(this.repo.manager.connection, async (em) => {
      newImage = await this.fileService.store(file, 'banner');
      let k = new AdBanner();
      k.url = dto.url;
      k.image = newImage;
      await this.fileService.use(newImage.id, em.getRepository(AppFile));
      return await em.save(AdBanner, k);
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
    transaction(
      this.repo.manager.connection,
      async (em) => {
        await this.fileService.delete(k.image.id, em.getRepository(AppFile));
        await em.remove(AdBanner, k);
      },
      {
        onDone: () => {
          this.fileService.cleanUp([k.image.id]);
        },
      },
    );
  }

  async edit(id: UUID, dto: AdBannerDto, file?: Express.Multer.File) {
    let k = await this.getById(id);
    k.url = dto.url;
    if (!file) {
      return await this.repo.save(k);
    }
    let oldImage = k.image;
    let newImage: AppFile | null;
    return await transaction(
      this.repo.manager.connection,
      async (em) => {
        newImage = await this.fileService.store(file, 'banner');
        await this.fileService.delete(oldImage.id, em.getRepository(AppFile));
        await this.fileService.use(newImage!.id, em.getRepository(AppFile));
        k.image = newImage!;
        return await em.save(AdBanner, k);
      },
      {
        onDone: () => {
          this.fileService.cleanUp([oldImage.id]);
        },
        onError: () => {
          if (newImage) {
            this.fileService.cleanUp([newImage.id]);
          }
        },
      },
    );
  }

  async getAll() {
    return await this.repo.find();
  }
}
