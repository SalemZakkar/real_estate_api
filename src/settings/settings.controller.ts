import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';
import { JwtGuard } from '../auth';
import { CASLGuard } from 'core';
import { SkipVersionCheck } from '../common/guards/version.guard';
@Controller('settings')
@UseGuards(JwtGuard, CASLGuard('management', 'manage'))
@UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
export class SettingsController {
  constructor(@Inject() private readonly service: SettingsService) {}
  @Post()
  async set(@Body() data: SettingsDto) {
    return { data: await this.service.update(data) };
  }

  @Get()
  @SkipVersionCheck()
  async getSettings() {
    return { data: await this.service.getSettings() };
  }
}
