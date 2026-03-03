"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordInitialErrors = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("./exceptions");
const dto_1 = require("../dto");
const nestjs_1 = require("../nestjs");
const RecordInitialErrors = () => {
    exceptions_1.ErrorsRecord.addErrors('MainErrors', [
        new common_1.BadRequestException(),
        new common_1.UnauthorizedException(),
        new common_1.NotFoundException(),
        new common_1.ForbiddenException(),
        new common_1.NotAcceptableException(),
        new common_1.RequestTimeoutException(),
        new common_1.ConflictException(),
        new common_1.GoneException(),
        new common_1.HttpVersionNotSupportedException(),
        new common_1.PayloadTooLargeException(),
        new common_1.UnsupportedMediaTypeException(),
        new common_1.UnprocessableEntityException(),
        new common_1.InternalServerErrorException(),
        new common_1.NotImplementedException(),
        new common_1.ImATeapotException(),
        new common_1.MethodNotAllowedException(),
        new common_1.BadGatewayException(),
        new common_1.ServiceUnavailableException(),
        new common_1.GatewayTimeoutException(),
        new common_1.PreconditionFailedException(),
    ]);
    exceptions_1.ErrorsRecord.addErrors('validator', [new dto_1.PasswordMissmatchException()]);
    exceptions_1.ErrorsRecord.addErrors('casl', [new common_1.ForbiddenException()]);
    exceptions_1.ErrorsRecord.addErrors('nestJS', [
        new nestjs_1.FileSizeNotAllowed(),
        new nestjs_1.FileTypeNotAllowed(),
    ]);
};
exports.RecordInitialErrors = RecordInitialErrors;
//# sourceMappingURL=record_initial_errors.js.map