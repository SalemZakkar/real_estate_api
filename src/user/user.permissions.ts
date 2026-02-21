import { AccessConfig, CASLPermissionsRegister } from 'core';
import { UserRoleType } from './entities/user-role.type';

export const enum UserActions {
  manage = 'Manage',
}

let UserPermissions: AccessConfig = {
  [UserRoleType.Admin]: (user) => [
    {
      action: UserActions.manage,
    },
  ],
};

CASLPermissionsRegister.register('User', UserPermissions);
