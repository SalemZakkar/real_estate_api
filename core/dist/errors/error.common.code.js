"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCommonCodes = void 0;
exports.mapExceptionToCommonCode = mapExceptionToCommonCode;
const common_1 = require("@nestjs/common");
var ErrorCommonCodes;
(function (ErrorCommonCodes) {
    ErrorCommonCodes["badInput"] = "BAD_INPUT";
    ErrorCommonCodes["notFound"] = "NOT_FOUND";
    ErrorCommonCodes["forbidden"] = "FORBIDDEN";
    ErrorCommonCodes["conflict"] = "CONFLICT";
    ErrorCommonCodes["internal"] = "INTERNAL";
    ErrorCommonCodes["unprocessableEntity"] = "UNPROCESSABLE_ENTITY";
    ErrorCommonCodes["unauthenticated"] = "UNAUTHENTICATED";
    ErrorCommonCodes["unauthorized"] = "UNAUTHORIZED";
    ErrorCommonCodes["invalidJwtToken"] = "INVALID_JWT_TOKEN";
    ErrorCommonCodes["jwtTokenExpired"] = "JWT_TOKEN_EXPIRED";
    ErrorCommonCodes["forbiddenQueryField"] = "FORBIDDEN_QUERY_FIELD";
    ErrorCommonCodes["forbiddenBodyField"] = "FORBIDDEN_BODY_FIELD";
    ErrorCommonCodes["wrongOtp"] = "WRONG_OTP";
    ErrorCommonCodes["wrongPassword"] = "WRONG_PASSWORD";
    ErrorCommonCodes["emailNotFound"] = "EMAIL_NOT_FOUND";
    ErrorCommonCodes["userNotFound"] = "USER_NOT_FOUND";
    ErrorCommonCodes["unknownError"] = "UNKNOWN_ERROR";
    ErrorCommonCodes["passwordMissmatched"] = "PASSWORD_MISSMATCH";
    ErrorCommonCodes["fileSizeNotAllowed"] = "FILE_SIZE_NOT_ALLOWED";
    ErrorCommonCodes["fileTypeNotAppowed"] = "FILE_TYPE_NOT_ALLOWED";
    ErrorCommonCodes["accountNotCompletedYet"] = "ACCOUNT_NOT_COMPLETED_YET";
    ErrorCommonCodes["invalidCredentials"] = "INVALID_CREDENTIALS";
    ErrorCommonCodes["userAlreadyExists"] = "USER_ALREADY_EXISTS";
    ErrorCommonCodes["versionNotSupported"] = "VERSION_NOT_SUPPORTED";
})(ErrorCommonCodes || (exports.ErrorCommonCodes = ErrorCommonCodes = {}));
function mapExceptionToCommonCode(exception) {
    if (exception instanceof common_1.NotFoundException) {
        return ErrorCommonCodes.notFound;
    }
    if (exception instanceof common_1.ConflictException) {
        return ErrorCommonCodes.conflict;
    }
    if (exception instanceof common_1.BadRequestException) {
        return ErrorCommonCodes.badInput;
    }
    if (exception instanceof common_1.ForbiddenException) {
        return ErrorCommonCodes.forbidden;
    }
    if (exception instanceof common_1.UnauthorizedException) {
        return ErrorCommonCodes.unauthenticated;
    }
    if (exception instanceof common_1.UnprocessableEntityException) {
        return ErrorCommonCodes.unprocessableEntity;
    }
    if (exception instanceof common_1.InternalServerErrorException) {
        return ErrorCommonCodes.internal;
    }
    if (exception instanceof common_1.HttpException) {
        // Fallback based on status code
        switch (exception.getStatus()) {
            case 400:
                return ErrorCommonCodes.badInput;
            case 401:
                return ErrorCommonCodes.unauthenticated;
            case 403:
                return ErrorCommonCodes.forbidden;
            case 404:
                return ErrorCommonCodes.notFound;
            case 409:
                return ErrorCommonCodes.conflict;
            case 422:
                return ErrorCommonCodes.unprocessableEntity;
            case 500:
                return ErrorCommonCodes.internal;
            default:
                return ErrorCommonCodes.unknownError;
        }
    }
    return ErrorCommonCodes.unknownError;
}
//# sourceMappingURL=error.common.code.js.map