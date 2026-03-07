import { Inject, Injectable } from '@nestjs/common';
import { SettingsDto } from './dto/settings.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppSettings } from './entity/app-settings.entity';
import { Repository } from 'typeorm';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AppSettings)
    private readonly repo: Repository<AppSettings>,
    @Inject('CACHE_MANAGER')
    private cache: Cache,
  ) {}
  async update(dto: SettingsDto) {
    let settings = (await this.repo.find({})).at(0);
    if (!settings) {
      settings = this.repo.create();
    }
    if (dto?.mobileMinVersion) {
      settings.mobileMinVersion = dto.mobileMinVersion;
    }
    if (dto?.webMinVersion) {
      settings.webMinVersion = dto.webMinVersion;
    }

    let res = await this.repo.save(settings);
    await this.cache.set('settings', res);
    return res;
  }

  async getSettings() {
    const cached = await this.cache.get<AppSettings>('settings');
    if (cached) return cached;
    const configs = await this.repo.find();
    await this.cache.set('settings', configs.at(0));
    return configs.at(0)!;
  }
}
