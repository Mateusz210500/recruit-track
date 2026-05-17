import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';

import { ApiError } from './api-error';

describe('ApiError', () => {
  it('maps HttpErrorResponse to ApiError', () => {
    const httpError = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: '/api/applications/missing',
      error: { message: 'Application missing' },
    });

    const result = ApiError.from(httpError);

    expect(result.status).toBe(404);
    expect(result.message).toBe('Application missing');
    expect(result.url).toBe('/api/applications/missing');
  });

  it('maps generic Error to ApiError', () => {
    const result = ApiError.from(new Error('boom'));

    expect(result.status).toBe(0);
    expect(result.message).toBe('boom');
  });
});
