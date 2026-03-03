import { Request, RequestHandler, Response } from 'express';

class ErrorRecord {
  table!: Map<string, any[]>;

  constructor() {
    this.table = new Map<string, string[]>();
  }

  getErrorsMap() {
    return this.table;
  }

  addErrors(code: string, error: string[]) {
    this.table.set(
      code,
      error,
    );
  }

  // getErrorsAsList() {
  //     return Array.from(this.table.values()).flat();
  // }
}

let errorRecord = new ErrorRecord();

export function createErrorRequestHandler(): RequestHandler {
  return (req: Request, res: Response) => {
    res.json(Object.fromEntries(errorRecord.getErrorsMap()));
  };
}

export { errorRecord as ErrorsRecord };
