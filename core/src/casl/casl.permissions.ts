import { Ability, AbilityBuilder } from '@casl/ability';

type PermissionFn = (user: any) => AccessAction[];
export type AccessConfig = Record<string, PermissionFn>;

export interface AccessAction {
  action: string | string[];
  fields?: string[] | undefined;
  userCondition?: ((body: any) => boolean) | undefined;
  entityCondition?: (entity: any) => boolean;
  dbQuery?: any;
  forbiddenBodyFields?: string[] | undefined;
  forbiddenQueryFields?: string[] | undefined;
  requestConditions?: (req: any) => boolean;
}

export interface CASLPermission {
  casl: Ability;
  fields?: string[] | undefined;
  userCondition?: ((body: any) => boolean) | undefined;
  entityCondition: (entity: any) => boolean;
  dbQuery?: any;
  forbiddenBodyFields?: string[] | undefined;
  forbiddenQueryFields?: string[] | undefined;
  requestConditions?: ((req: any) => boolean) | undefined;
}

export function buildCASL(
  subject: string,
  action: string,
  user: any,
  role: string | undefined = undefined,
): CASLPermission | undefined {
  let access = reg.getAccessConfig(subject);

  if (!access) return;

  const roleAccess = access[role ?? '*'];

  // console.log("Role Access " + roleAccess);
  

  

  if (!roleAccess) return;

  const { can, build } = new AbilityBuilder(Ability);
  // console.log(subject);
  // console.log(user);
  // console.log(role);
  // console.log(action);

  let permissions = roleAccess(user) || [];

  for (const permission of permissions) {
    const actions = (
      Array.isArray(permission.action) ? permission.action : [permission.action]
    ).map((a) => a.trim().toLowerCase());
    
    if (!actions.includes(action.toLowerCase()) && !actions.includes('manage')) continue;


    actions.forEach((act) => {
      can(act, subject);
    });

    return {
      casl: build(),
      fields: permission.fields,
      userCondition: permission.userCondition,
      entityCondition: permission.entityCondition || (() => true),
      dbQuery: permission.dbQuery,
      forbiddenBodyFields: permission.forbiddenBodyFields,
      forbiddenQueryFields: permission.forbiddenQueryFields,
      requestConditions: permission.requestConditions,
    };
  }
}

class Reg {
  permissionTable: Map<string, AccessConfig> = new Map();
  register(subject: string, access: AccessConfig) {
    this.permissionTable.set(subject, access);
  }
  getAccessConfig(subject: string) {
    return this.permissionTable.get(subject);
  }
}

let reg = new Reg();

export { reg as CASLPermissionsRegister };
