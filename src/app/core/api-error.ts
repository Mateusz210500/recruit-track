import { HttpErrorResponse } from '@angular/common/http';

export class ApiError {
  constructor(
    readonly status: number,
    readonly message: string,
    readonly url?: string,
    readonly code?: string,
  ) {}

  static from(error: unknown): ApiError {
    if (error instanceof HttpErrorResponse) {
      const body = error.error;
      const message =
        (typeof body === 'object' &&
          body !== null &&
          'message' in body &&
          typeof body.message === 'string' &&
          body.message) ||
        error.message ||
        error.statusText;
      const code =
        typeof body === 'object' &&
        body !== null &&
        'code' in body &&
        typeof body.code === 'string'
          ? body.code
          : undefined;

      return new ApiError(error.status, message, error.url ?? undefined, code);
    }

    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(0, error.message);
    }

    return new ApiError(0, 'Unknown error');
  }

  userMessage(): string {
    switch (this.code) {
      case 'SCRAPE_EMPTY':
        return 'Could not read enough content from this job posting.';
      case 'SCRAPE_FAILED':
        return 'Failed to load the job posting. Try another URL.';
      case 'EXTRACTION_FAILED':
        return 'Could not extract job details. Fill the form manually.';
      case 'AI_QUOTA_EXCEEDED':
        return 'AI quota exceeded. Try again later.';
      default:
        return this.message;
    }
  }
}
