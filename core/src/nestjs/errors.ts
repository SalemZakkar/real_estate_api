import { HttpException } from '@nestjs/common';

export class FileSizeNotAllowed extends HttpException {
  constructor(size?: number, foundedSize?: number) {
    super(
      size && foundedSize
        ? `File Size Too Big ${size} must be less than or equal ${foundedSize}`
        : 'File Size Too Big',
      400,
    );
  }
}

export class FileTypeNotAllowed extends HttpException {
  constructor(type?: string, types?: string[]) {
    super(
      types
        ? `File Not Allowed ${type} must be one of ${types}`
        : 'File Not Allowed',
      400,
    );
  }
}
