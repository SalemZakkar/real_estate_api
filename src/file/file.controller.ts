import { Controller, Get, Inject, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { UUID } from 'node:crypto';
import { Response } from 'express';
import { ParseUUIDPipe } from '@nestjs/common';
@Controller('files')
export class FileController {
  constructor(@Inject() private readonly service: FileService) {}

  @Get('/:id')
  async getById(@Param('id' , new ParseUUIDPipe()) id: UUID, @Res() res: Response) {
    let file = await this.service.getById(id);
    res.setHeader('Content-Type', file.type);
    res.sendFile(file.path);
  }
}
