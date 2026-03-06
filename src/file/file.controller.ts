import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { FileService } from './file.service';
import { UUID } from 'node:crypto';
import { Response, Request } from 'express';
import { ParseUUIDPipe } from '@nestjs/common';
import { createReadStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import { log } from 'node:console';
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
    // @Req() req: Request,
  ) {
    let file = await this.service.getById(id);
    res.setHeader('Content-Type', file.type);
    // let range = req.headers.range;
    // if (!range) {
    return res.status(200).sendFile(file.path);
    // } else {
    //   const stat = fs.stat(file.path);
    //   const regex = /^(\d+)?-(\d+)?$/;
    //   range = range.replace('bytes=', '');
    //   const parts = range.match(regex) ?? [];
    //   try {
    //     const start = parts[1] ? parseInt(parts[1], 10) : 0;
    //     const end = parts[2] ? parseInt(parts[2], 10) : (await stat).size;
    //     if (start >= end) {
    //       throw new BadRequestException();
    //     }
    //     const rs = createReadStream(file.path, { start, end });
    //     rs.pipe(res);
    //   } catch (e) {
    //     console.log(e);
    //     throw new InternalServerErrorException();
    //   }
    // }
  }
}
