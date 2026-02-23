import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyCreateDto } from './dto/property-create.dto';
import { PropertyEditDto } from './dto/property-edit.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';
import { ImageFileValidatorPipeline } from '../common';
import { JwtGuard } from '../auth';
import { Request } from 'express';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: PropertyCreateDto, @Req() req: Request) {
    return {
      data: await this.propertyService.create(dto, (req.user as any).id),
    };
  }

  @Patch(':id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Body() dto: PropertyEditDto,
  ) {
    return { data: await this.propertyService.edit(id, dto) };
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return { data: await this.propertyService.getById(id) };
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: UUID) {
    await this.propertyService.delete(id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image'))
  async addImage(
    @Param('id') id: UUID,
    @UploadedFile(new ImageFileValidatorPipeline(true))
    file: Express.Multer.File,
  ) {
    return { data: await this.propertyService.addImage(id, file) };
  }

  @Delete(':id/images/:fileId')
  async deleteImage(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Param('fileId', new ParseUUIDPipe()) fileId: UUID,
  ) {
    return this.propertyService.deleteImage(id, fileId);
  }
}
