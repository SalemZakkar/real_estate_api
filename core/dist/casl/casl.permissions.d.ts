import { Ability } from '@casl/ability';
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
export declare function buildCASL(subject: string, action: string, user: any, role?: string | undefined): CASLPermission | undefined;
declare class Reg {
    permissionTable: Map<string, AccessConfig>;
    register(subject: string, access: AccessConfig): void;
    getAccessConfig(subject: string): AccessConfig | undefined;
}
declare let reg: Reg;
export { reg as CASLPermissionsRegister };
//# sourceMappingURL=casl.permissions.d.ts.map