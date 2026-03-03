import { RequestHandler } from 'express';
declare class ErrorRecord {
    table: Map<string, any[]>;
    constructor();
    getErrorsMap(): Map<string, any[]>;
    addErrors(code: string, error: string[]): void;
}
declare let errorRecord: ErrorRecord;
export declare function createErrorRequestHandler(): RequestHandler;
export { errorRecord as ErrorsRecord };
//# sourceMappingURL=exceptions.d.ts.map