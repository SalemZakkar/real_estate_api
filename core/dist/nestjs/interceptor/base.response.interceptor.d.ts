import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export declare const NO_BASE_RESPONSE_KEY = "noBaseResponse";
export declare const NoBaseResponse: () => import("@nestjs/common").CustomDecorator<string>;
export declare class BaseResponseInterceptor implements NestInterceptor {
    private reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
//# sourceMappingURL=base.response.interceptor.d.ts.map