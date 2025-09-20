import { NextResponse } from 'next/server';

export interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string;
  type?: string;
  data?: any;
}

export class ApiResponseHandler {
  static success(data: any, message: string = 'Success', status: number = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data
      },
      { status }
    );
  }

  static error(error: string, type?: string, details?: string, status: number = 400) {
    const response: ApiResponse = {
      success: false,
      error,
      type,
      details
    };

    return NextResponse.json(response, { status });
  }

  static validationError(errors: string[] | { path: string; message: string }[], type: string = 'validation_error') {
    const payload = Array.isArray(errors) && errors.length && typeof errors[0] === 'string'
      ? (errors as string[]).map((msg) => ({ path: 'unknown', message: msg }))
      : (errors as { path: string; message: string }[]);
    return NextResponse.json({ success: false, type, error: 'Validation failed', details: payload }, { status: 400 });
  }

  static badRequest(error: string, type?: string) {
    return this.error(error, type, undefined, 400);
  }

  static conflict(error: string, type: string) {
    return this.error(error, type, undefined, 409);
  }

  static forbidden(error: string, type?: string) {
    return this.error(error, type, undefined, 403);
  }

  static internalError(error: string = 'Internal server error') {
    return this.error(error, 'internal_error', undefined, 500);
  }

  static created(data: any, message: string = 'Created successfully') {
    return this.success(data, message, 201);
  }
}
