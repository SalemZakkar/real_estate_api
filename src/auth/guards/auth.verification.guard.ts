import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AuthAccountNotCompletedException } from '../auth.errors';

export function AuthVerificationGuard(): Type<CanActivate> {
  class EmailVerifiedGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user?.isCompleted) {
        throw new AuthAccountNotCompletedException();
      }

      return true;
    }
  }

  return mixin(EmailVerifiedGuardMixin);
}
