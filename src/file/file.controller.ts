import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { UUID } from 'node:crypto';
import { Response, Request } from 'express';
import { ParseUUIDPipe } from '@nestjs/common';
@Controller('files')
export class FileController {
  constructor(@Inject() private readonly service: FileService) {}

  @Get(':id/thumbnail')
  async getThumbnail(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Res() res: Response,
  ) {
    const buffer = await this.service.getVideoThumbnail(id);

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Get('/:id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: UUID,
    @Res() res: Response,
  ) {
    let file = await this.service.getById(id);
    res.setHeader('Content-Type', file.type);
    return res.status(200).sendFile(file.path);
  }
}
