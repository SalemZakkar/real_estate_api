import { HttpException } from '@nestjs/common';
import { ErrorsRecord } from 'core';
// import { ErrorsRecord } from 'core';

export class AuthWrongCredentialsException extends HttpException {
  constructor() {
    super('Wrong Credentials', 400);
  }
}

export class AuthInvalidTokenException extends HttpException {
  constructor() {
    super('Invalid Token', 400);
  }
}
export class AuthRefreshTokenExpiredException extends HttpException {
  constructor() {
    super('Refresh Token Expired', 401);
  }
}

export class AuthUnAuthenticatedException extends HttpException {
  constructor() {
    super('UnAuthenticated', 401);
  }
}

export class AuthAccountNotCompletedException extends HttpException {
  constructor() {
    super('Please Complete this account first', 403);
  }
}

ErrorsRecord.addErrors('AUTH', [
  new AuthWrongCredentialsException(),
  new AuthInvalidTokenException(),
  new AuthRefreshTokenExpiredException(),
  new AuthUnAuthenticatedException(),
  new AuthUnAuthenticatedException(),
  new AuthAccountNotCompletedException()
]);
