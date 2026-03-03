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
        this.table.set(code, error.map((e) => {
            const response = e.getResponse();
            let message;
            if (typeof response === 'string') {
                message = response;
            }
            else if (typeof response === 'object' && response !== null) {
                const r = response;
                message = Array.isArray(r.message)
                    ? r.message.join(', ')
                    : (r.message ?? e.message);
            }
            else {
                message = e.message;
            }
            return {
                code: e.name,
                statusCode: e.getStatus(),
                message,
            };
        }));
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