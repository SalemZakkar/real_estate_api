import { ErrorsRecord } from 'core';

export enum FileErrors {
  invalidThumbnail = 'INVALID_THUMBNAIL',
}

ErrorsRecord.addErrors('FILE', Object.values(FileErrors));
