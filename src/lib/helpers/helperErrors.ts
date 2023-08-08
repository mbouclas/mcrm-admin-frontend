import { z } from 'zod';
import errors from './errors';

export type ServerError = {
  error: string;
  code: string;
  statusCode: number;
  validationErrors: {
    field: string;
    code: string;
  }[];
};

export type ValidationError = {
  field: string;
  message: string;
};

export type RequestError = {
  error: string;
  code: string;
  statusCode: number;
  validationErrors: ValidationError[];
};

export class RequestErrorException extends Error {
  public details: RequestError;

  constructor(name: string, requestError: RequestError) {
    super(requestError.error);
    this.name = name;
    this.details = requestError;
  }
}

type ZodSchema<T> = z.Schema<T>;

export const transformErrors = (zodError: z.ZodError): ValidationError[] => {
  const customErrors = [];

  zodError.issues.forEach((issue) => {
    const field = issue.path.join('.');
    const message = issue.message;
    customErrors.push({ field, message });
  });

  return customErrors;
};

export const validateClientData = <T>(schema: ZodSchema<T>, data: any): T | never => {
  try {
    return schema.parse(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new RequestErrorException('ClientValidationError', {
        error: null,
        code: null,
        statusCode: null,
        validationErrors: transformErrors(e),
      });
    }
  }
};

export const convertServerErrorToRequestError = (serverError: ServerError): RequestError => {
  return {
    error: serverError.error,
    code: serverError.code,
    statusCode: serverError.statusCode,
    validationErrors: serverError.validationErrors.map((validationError) => {
      return {
        field: validationError.field,
        message: errors[validationError.code] || 'Unknown error',
      };
    }),
  };
};

export const handleValidationErrors = (
  validationErrors: ValidationError[],
  dataStatus: { [field: string]: { errors: string[] } },
  renameRules: { [field: string]: string },
): { [field: string]: { errors: string[] } } => {
  const newDataStatus = { ...dataStatus };

  validationErrors.forEach((validationError) => {
    const field =
      renameRules && renameRules[validationError.field] ? renameRules[validationError.field] : validationError.field;

    if (newDataStatus[field]) {
      newDataStatus[field].errors = [...newDataStatus[field].errors, validationError.message];
    } else {
      newDataStatus[field] = {
        errors: [validationError.message],
      };
    }
  });

  return newDataStatus;
};
