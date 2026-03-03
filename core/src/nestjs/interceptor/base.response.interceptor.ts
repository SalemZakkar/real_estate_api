import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const NO_BASE_RESPONSE_KEY = 'noBaseResponse';
export const NoBaseResponse = () => SetMetadata(NO_BASE_RESPONSE_KEY, true);

@Injectable()
export class BaseResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(
      NO_BASE_RESPONSE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skip) {
      return next.handle(); // skip wrapping
    }

    return next.handle().pipe(
      map((data) => {
        if (!data || typeof data !== 'object') {
          // Only include 'data' if it's not null/undefined
          const response: any = { message: 'Success' };
          if (data !== null && data !== undefined) {
            response.data = data;
          }
          return response;
        }

        const { totalRecords, data: mainData, ...rest } = data;

        const response: any = { message: 'Success' };

        if (totalRecords !== undefined) {
          response.totalRecords = totalRecords;
        }

        if (mainData !== null && mainData !== undefined) {
          response.data = mainData; // only add if exists
        }

        Object.assign(response, rest);

        return response;
      }),
    );
  }
}
