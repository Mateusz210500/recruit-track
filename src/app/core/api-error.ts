import { HttpErrorResponse } from '@angular/common/http';

export class ApiError {
  constructor(
    readonly status: number,
    readonly message: string,
    readonly url?: string,
  ) {}

  static from(error: unknown): ApiError {
    if (error instanceof HttpErrorResponse) {
      return new ApiError(
        error.status,
        error.error?.message ?? error.message ?? error.statusText,
        error.url ?? undefined,
      );
    }

    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(0, error.message);
    }

    return new ApiError(0, 'Unknown error');
  }
}
