"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsRecord = void 0;
exports.createErrorRequestHandler = createErrorRequestHandler;
class ErrorRecord {
    constructor() {
        this.table = new Map();
    }
    getErrorsMap() {
        return this.table;
    }
    addErrors(code, error) {
        this.table.set(code, error);
    }
}
let errorRecord = new ErrorRecord();
exports.ErrorsRecord = errorRecord;
function createErrorRequestHandler() {
    return (req, res) => {
        res.json(Object.fromEntries(errorRecord.getErrorsMap()));
    };
}
//# sourceMappingURL=exceptions.js.map