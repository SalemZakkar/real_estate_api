import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AboutUs } from './entities/about-us.entity';
import { AboutUsDto } from './dto/about-us.dto';
@Injectable()
export class AboutUsService {
  constructor(
    @InjectRepository(AboutUs) private readonly repo: Repository<AboutUs>,
  ) {}

  async getAll(): Promise<AboutUs> {
    let config = await this.repo.findOne({ where: {} });

    if (!config) {
      config = this.repo.create({
        description: null,
        facebookLink: null,
        instagramLink: null,
        privacyPolicy: null,
        termsAndConditions: null,
        phones: [],
      });
      await this.repo.save(config);
    }
    return config;
  }

  async update(aboutUsDto: AboutUsDto): Promise<AboutUs> {
    const existing = await this.getAll();

    const updateData: Partial<AboutUs> = {};

    if (aboutUsDto.instagramLink !== undefined) {
      updateData.instagramLink = aboutUsDto.instagramLink;
    }

    if (aboutUsDto.facebookLink !== undefined) {
      updateData.facebookLink = aboutUsDto.facebookLink;
    }

    if (aboutUsDto.description !== undefined) {
      updateData.description = aboutUsDto.description;
    }

    if (aboutUsDto.termsAndConditions !== undefined) {
      updateData.termsAndConditions = aboutUsDto.termsAndConditions;
    }

    if (aboutUsDto.privacyPolicy !== undefined) {
      updateData.privacyPolicy = aboutUsDto.privacyPolicy;
    }

    if (aboutUsDto.phones?.length) {
      existing.phones =aboutUsDto.phones;
    }

    Object.assign(existing, updateData);

    return await this.repo.save(existing);
  }
}
