import { HttpException } from '@nestjs/common';
import { ErrorsRecord } from 'core';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super('User Already Exists', 400);
  }
}

ErrorsRecord.addErrors('user', [
  new UserAlreadyExistsException(),
]);
