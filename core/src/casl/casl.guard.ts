import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common';
import { buildCASL } from './casl.permissions';

export const CASLGuard = (
  subject: string,
  action: string,
): Type<CanActivate> => {
  @Injectable()
  class PermissionGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const permission = buildCASL(subject, action, user, user?.role);

      if (!permission || !permission.casl.can(action.toLowerCase(), subject)) {
        throw new ForbiddenException(`Forbidden: cannot ${action} ${subject}`);
      }
      if (permission.requestConditions) {
        if (!permission.requestConditions(request.body)) {
          throw new ForbiddenException('some body values are not allowed');
        }
      }
      if (permission.forbiddenBodyFields) {
        for (const field of permission.forbiddenBodyFields) {
          if (request.body && request.body[field] != undefined) {
            throw new ForbiddenException('Field ( ' + field + ' ) Not Allowed');
          }
        }
      }

      if (permission.forbiddenQueryFields) {
        for (const field of permission.forbiddenQueryFields) {
          if (request.query && request.query[field] != undefined) {
            throw new ForbiddenException('Field ' + field + ' Not Allowed');
          }
        }
      }

      if (
        permission.userCondition != undefined &&
        !permission.userCondition(user)
      ) {
        throw new ForbiddenException("User doesn't have permission");
      }
      request.permissions = permission;
      return true;
    }
  }

  return PermissionGuardMixin;
};
