import { Provider } from '@angular/core';

import { API_BASE_URL } from './api.config';

export function provideApiConfig(baseUrl = ''): Provider {
  return { provide: API_BASE_URL, useValue: baseUrl };
}
