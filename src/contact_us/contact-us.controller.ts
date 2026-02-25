import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { UUID } from 'crypto';
import { ContactUsDto } from './dto/contact-us.dto';
import { ContactUsType } from './entities/contact-us.enum';
import { JwtGuard } from '../auth';
import { CASLGuard } from 'core';

@Controller('/contactUs')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class ContactUsController {
  constructor(private readonly service: ContactUsService) {}

  @Get()
  async get() {
    return { data: await this.service.getAll() };
  }

  @Get('/meta')
  async getMetaData() {
    return { ContactUsType: Object.values(ContactUsType) };
  }

  @UseGuards(JwtGuard, CASLGuard('ContactUs', 'manage'))
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: UUID) {
    await this.service.delete(id);
  }

  @UseGuards(JwtGuard, CASLGuard('ContactUs', 'manage'))
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Body() dto: ContactUsDto,
  ) {
    return {
      data: await this.service.edit(id, dto),
    };
  }

  @UseGuards(JwtGuard, CASLGuard('ContactUs', 'manage'))
  @Post()
  async create(@Body() dto: ContactUsDto) {
    return {
      data: await this.service.save(dto),
    };
  }
}
