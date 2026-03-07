import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export enum ErrorCommonCodes {
  badInput = 'BAD_INPUT',
  notFound = 'NOT_FOUND',
  forbidden = 'FORBIDDEN',
  conflict = 'CONFLICT',
  internal = 'INTERNAL',
  unprocessableEntity = 'UNPROCESSABLE_ENTITY',
  unauthenticated = 'UNAUTHENTICATED',
  unauthorized = 'UNAUTHORIZED',
  invalidJwtToken = 'INVALID_JWT_TOKEN',
  jwtTokenExpired = 'JWT_TOKEN_EXPIRED',
  forbiddenQueryField = 'FORBIDDEN_QUERY_FIELD',
  forbiddenBodyField = 'FORBIDDEN_BODY_FIELD',
  wrongOtp = 'WRONG_OTP',
  wrongPassword = 'WRONG_PASSWORD',
  emailNotFound = 'EMAIL_NOT_FOUND',
  userNotFound = 'USER_NOT_FOUND',
  unknownError = 'UNKNOWN_ERROR',
  passwordMissmatched = 'PASSWORD_MISSMATCH',
  fileSizeNotAllowed = 'FILE_SIZE_NOT_ALLOWED',
  fileTypeNotAppowed = 'FILE_TYPE_NOT_ALLOWED',
  accountNotCompletedYet = 'ACCOUNT_NOT_COMPLETED_YET',
  invalidCredentials = 'INVALID_CREDENTIALS',
  userAlreadyExists = 'USER_ALREADY_EXISTS',
  versionNotSupported = 'VERSION_NOT_SUPPORTED'
}

export function mapExceptionToCommonCode(exception: unknown): ErrorCommonCodes {
  if (exception instanceof NotFoundException) {
    return ErrorCommonCodes.notFound;
  }

  if (exception instanceof ConflictException) {
    return ErrorCommonCodes.conflict;
  }

  if (exception instanceof BadRequestException) {
    return ErrorCommonCodes.badInput;
  }

  if (exception instanceof ForbiddenException) {
    return ErrorCommonCodes.forbidden;
  }

  if (exception instanceof UnauthorizedException) {
    return ErrorCommonCodes.unauthenticated;
  }

  if (exception instanceof UnprocessableEntityException) {
    return ErrorCommonCodes.unprocessableEntity;
  }

  if (exception instanceof InternalServerErrorException) {
    return ErrorCommonCodes.internal;
  }

  if (exception instanceof HttpException) {
    // Fallback based on status code
    switch (exception.getStatus()) {
      case 400:
        return ErrorCommonCodes.badInput;
      case 401:
        return ErrorCommonCodes.unauthenticated;
      case 403:
        return ErrorCommonCodes.forbidden;
      case 404:
        return ErrorCommonCodes.notFound;
      case 409:
        return ErrorCommonCodes.conflict;
      case 422:
        return ErrorCommonCodes.unprocessableEntity;
      case 500:
        return ErrorCommonCodes.internal;
      default:
        return ErrorCommonCodes.unknownError;
    }
  }

  return ErrorCommonCodes.unknownError;
}
