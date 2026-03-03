import { HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppHttpError, ErrorCommonCodes } from 'core';

export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (!user || err) {
      throw new AppHttpError({
        code: ErrorCommonCodes.unauthenticated,
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthinticated',
      });
    }
    return user;
  }
}

export class JwtOptionalGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    return user || null;
  }
}
