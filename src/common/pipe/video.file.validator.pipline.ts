import { FileValidationPipeline } from 'core';

export class VideoFileValidatorPipeline extends FileValidationPipeline {
  constructor(required?: boolean) {
    super({
      size: 30 * 1024 * 1024,
      required: required,
      types: [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
        'video/mpeg',
        'video/ogg',
        'video/3gpp',
      ],
    });
  }
}
