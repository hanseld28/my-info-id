export type AppErrorCode = 
  | 'VALIDATION_ERROR'
  | 'TAG_NOT_FOUND'
  | 'TAG_DATA_INSERT_ERROR'
  | 'CONTACTS_INSERT_ERROR'
  | 'TAG_ACTIVATION_ERROR'
  | 'CONSENT_LOG_ERROR'
  | 'UNAUTHORIZED'
  | 'INTERNAL_SERVER_ERROR';

export class AppError<T> extends Error {
  public readonly statusCode: number;
  public readonly code: AppErrorCode;
  public readonly details?: T;

  constructor(message: string, statusCode: number, code: AppErrorCode, details?: T) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError<string[]> {
  constructor(message: string, details?: string[]) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError<undefined> {
  constructor(message: string = 'Recurso não encontrado', code: AppErrorCode = 'TAG_NOT_FOUND') {
    super(message, 404, code);
  }
}

export class DatabaseError extends AppError<undefined> {
  constructor(message: string, code: AppErrorCode) {
    super(message, 500, code);
  }
}