import { HttpException } from '@nestjs/common';
import { Request, RequestHandler, Response } from 'express';

class ErrorRecord {
  table!: Map<string, any[]>;

  constructor() {
    this.table = new Map<string, HttpException[]>();
  }

  getErrorsMap() {
    return this.table;
  }

  addErrors(code: string, error: HttpException[]) {
    this.table.set(
      code,
      error.map((e) => {
        const response = e.getResponse();

        let message: string;

        if (typeof response === 'string') {
          message = response;
        } else if (typeof response === 'object' && response !== null) {
          const r = response as any;
          message = Array.isArray(r.message)
            ? r.message.join(', ')
            : (r.message ?? e.message);
        } else {
          message = e.message;
        }

        return {
          code: e.name,
          statusCode: e.getStatus(),
          message,
        };
      }),
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
