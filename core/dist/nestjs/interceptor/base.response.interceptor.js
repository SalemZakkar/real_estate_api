"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponseInterceptor = exports.NoBaseResponse = exports.NO_BASE_RESPONSE_KEY = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
exports.NO_BASE_RESPONSE_KEY = 'noBaseResponse';
const NoBaseResponse = () => (0, common_2.SetMetadata)(exports.NO_BASE_RESPONSE_KEY, true);
exports.NoBaseResponse = NoBaseResponse;
let BaseResponseInterceptor = class BaseResponseInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const skip = this.reflector.getAllAndOverride(exports.NO_BASE_RESPONSE_KEY, [context.getHandler(), context.getClass()]);
        if (skip) {
            return next.handle(); // skip wrapping
        }
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            if (!data || typeof data !== 'object') {
                // Only include 'data' if it's not null/undefined
                const response = { message: 'Success' };
                if (data !== null && data !== undefined) {
                    response.data = data;
                }
                return response;
            }
            const { totalRecords, data: mainData, ...rest } = data;
            const response = { message: 'Success' };
            if (totalRecords !== undefined) {
                response.totalRecords = totalRecords;
            }
            if (mainData !== null && mainData !== undefined) {
                response.data = mainData; // only add if exists
            }
            Object.assign(response, rest);
            return response;
        }));
    }
};
exports.BaseResponseInterceptor = BaseResponseInterceptor;
exports.BaseResponseInterceptor = BaseResponseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], BaseResponseInterceptor);
//# sourceMappingURL=base.response.interceptor.js.map