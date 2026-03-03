"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeNotAllowed = exports.FileSizeNotAllowed = void 0;
const common_1 = require("@nestjs/common");
class FileSizeNotAllowed extends common_1.HttpException {
    constructor(size, foundedSize) {
        super(size && foundedSize
            ? `File Size Too Big ${size} must be less than or equal ${foundedSize}`
            : 'File Size Too Big', 400);
    }
}
exports.FileSizeNotAllowed = FileSizeNotAllowed;
class FileTypeNotAllowed extends common_1.HttpException {
    constructor(type, types) {
        super(types
            ? `File Not Allowed ${type} must be one of ${types}`
            : 'File Not Allowed', 400);
    }
}
exports.FileTypeNotAllowed = FileTypeNotAllowed;
//# sourceMappingURL=errors.js.map