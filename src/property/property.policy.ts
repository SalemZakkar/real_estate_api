import { AccessConfig, CASLPermissionsRegister } from 'core';
import { UserRoleType } from '../user/entities/user-role.type';
import { PropertyStatus } from './entites/property.enum';

export enum PropertyActions {
  manage = 'manage',
  delete = 'Delete',
  edit = 'edit',
  changeStatus = 'changeStatus',
  getAll = 'GetAll',
}

let policy: AccessConfig = {
  [UserRoleType.Admin]: (user) => [
    {
      action: PropertyActions.manage,
    },
  ],
  [UserRoleType.User]: (user) => [
    {
      action: PropertyActions.edit,
      entityCondition: (entity) => {
        return (
          entity.owner.id == user.id &&
          [PropertyStatus.unCompleted, PropertyStatus.pending].includes(entity.status)
        );
      },
      forbiddenBodyFields: ['isFeature'],
    },
    {
      action: PropertyActions.delete,
      entityCondition: (entity) => {
        return entity.owner.id == user.id;
      },
    },
    {
      action: PropertyActions.getAll,
      forbiddenQueryFields: ['status'],

      dbQuery: ['p.status = :status', { status: PropertyStatus.active }],
    },
    {
      action: PropertyActions.changeStatus,
      requestConditions: (v) => {
        let s = v.status;
        if (s) {
          return [
            PropertyStatus.active,
            PropertyStatus.unActivated,
            PropertyStatus.pending,
          ].includes(s);
        }
        return true;
      },
      entityCondition: (entity) => {
        return entity.owner.id == user.id;
      },
    },
  ],
  '*': () => [
    {
      action: PropertyActions.getAll,
      forbiddenQueryFields: ['status'],
      dbQuery: ['p.status = :status', { status: PropertyStatus.active }],
    },
  ],
};

CASLPermissionsRegister.register('Property', policy);
