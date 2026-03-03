import { CanActivate, ExecutionContext, HttpStatus, mixin, Type } from '@nestjs/common';
import { AppHttpError, ErrorCommonCodes } from 'core';

export function AuthVerificationGuard(): Type<CanActivate> {
  class EmailVerifiedGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user?.isCompleted) {
        throw new AppHttpError({
          code: ErrorCommonCodes.accountNotCompletedYet,
          statusCode: HttpStatus.FORBIDDEN,
          message: 'Account not verified yet',
        });
      }
      return true;
    }
  }

  return mixin(EmailVerifiedGuardMixin);
}
