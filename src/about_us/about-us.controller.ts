import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth';
import { CASLGuard } from 'core';
import { AboutUsService } from './about-us.service';
import { AboutUsDto } from './dto/about-us.dto';
import { SkipVersionCheck } from '../common/guards/version.guard';

@Controller('/aboutus')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class AboutUsController {
  constructor(private readonly service: AboutUsService) {}

  @Get()
  @SkipVersionCheck()
  async get() {
    return { data: await this.service.getAll() };
  }

  @UseGuards(JwtGuard, CASLGuard('management', 'manage'))
  @Put()
  async update(@Body() dto: AboutUsDto) {
    return {
      data: await this.service.update(dto),
    };
  }
}
