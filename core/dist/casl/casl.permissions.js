"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CASLPermissionsRegister = void 0;
exports.buildCASL = buildCASL;
const ability_1 = require("@casl/ability");
function buildCASL(subject, action, user, role = undefined) {
    let access = reg.getAccessConfig(subject);
    if (!access)
        return;
    const roleAccess = access[role ?? '*'];
    // console.log("Role Access " + roleAccess);
    if (!roleAccess)
        return;
    const { can, build } = new ability_1.AbilityBuilder(ability_1.Ability);
    // console.log(subject);
    // console.log(user);
    // console.log(role);
    // console.log(action);
    let permissions = roleAccess(user) || [];
    for (const permission of permissions) {
        const actions = (Array.isArray(permission.action) ? permission.action : [permission.action]).map((a) => a.trim().toLowerCase());
        if (!actions.includes(action.toLowerCase()) && !actions.includes('manage'))
            continue;
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
    constructor() {
        this.permissionTable = new Map();
    }
    register(subject, access) {
        this.permissionTable.set(subject, access);
    }
    getAccessConfig(subject) {
        return this.permissionTable.get(subject);
    }
}
let reg = new Reg();
exports.CASLPermissionsRegister = reg;
//# sourceMappingURL=casl.permissions.js.map