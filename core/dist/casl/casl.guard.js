"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CASLGuard = void 0;
const common_1 = require("@nestjs/common");
const casl_permissions_1 = require("./casl.permissions");
const CASLGuard = (subject, action) => {
    let PermissionGuardMixin = class PermissionGuardMixin {
        canActivate(context) {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            const permission = (0, casl_permissions_1.buildCASL)(subject, action, user, user?.role);
            if (!permission || !permission.casl.can(action.toLowerCase(), subject)) {
                throw new common_1.ForbiddenException(`Forbidden: cannot ${action} ${subject}`);
            }
            if (permission.requestConditions) {
                if (!permission.requestConditions(request.body)) {
                    throw new common_1.ForbiddenException('some body values are not allowed');
                }
            }
            if (permission.forbiddenBodyFields) {
                for (const field of permission.forbiddenBodyFields) {
                    if (request.body && request.body[field] != undefined) {
                        throw new common_1.ForbiddenException('Field ( ' + field + ' ) Not Allowed');
                    }
                }
            }
            if (permission.forbiddenQueryFields) {
                for (const field of permission.forbiddenQueryFields) {
                    if (request.query && request.query[field] != undefined) {
                        throw new common_1.ForbiddenException('Field ' + field + ' Not Allowed');
                    }
                }
            }
            if (permission.userCondition != undefined &&
                !permission.userCondition(user)) {
                throw new common_1.ForbiddenException("User doesn't have permission");
            }
            request.permissions = permission;
            return true;
        }
    };
    PermissionGuardMixin = __decorate([
        (0, common_1.Injectable)()
    ], PermissionGuardMixin);
    return PermissionGuardMixin;
};
exports.CASLGuard = CASLGuard;
//# sourceMappingURL=casl.guard.js.map