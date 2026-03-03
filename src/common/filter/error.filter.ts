import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { AppHttpError, ErrorCommonCodes, mapExceptionToCommonCode } from 'core';
import { Response } from 'express';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppHttpError) {
      return response.status(exception.statusCode).json({
        message: exception.message,
        code: exception.code,
        args: exception.args,
      });
    }
    if (exception instanceof HttpException) {
    //   console.log(exception);
    //   console.log(exception.message);
    //   console.log(exception.getResponse());

      let error = exception.getResponse();

      return response.status(exception.getStatus()).json({
        message: error['message']?.toString() || exception.message,
        code: error['code'] ?? mapExceptionToCommonCode(exception),
      });
    }
    console.log(exception);

    response.status(500).json({
      message: 'AHH',
    });
  }
}
