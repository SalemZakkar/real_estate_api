import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { JwtGuard } from '../auth';
import { CASLGuard } from 'core';
import { AdBannerSerivce } from './ad-banner.service';
import { AdBannerDto } from './dto/ad-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidatorPipeline } from '../common';

@Controller('/adbanner')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class AdBannerController {
  constructor(private readonly service: AdBannerSerivce) {}

  @Get()
  async get() {
    return { data: await this.service.getAll() };
  }

  @UseGuards(JwtGuard, CASLGuard('management', 'manage'))
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: UUID) {
    await this.service.delete(id);
  }

  @UseGuards(JwtGuard, CASLGuard('management', 'manage'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Body() dto: AdBannerDto,
    @UploadedFile(new ImageFileValidatorPipeline())
    file: Express.Multer.File,
  ) {
    return {
      data: await this.service.edit(id, dto, file),
    };
  }

  @UseGuards(JwtGuard, CASLGuard('management', 'manage'))
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body() dto: AdBannerDto,
    @UploadedFile(new ImageFileValidatorPipeline(true))
    file: Express.Multer.File,
  ) {
    return {
      data: await this.service.save(dto, file),
    };
  }
}
