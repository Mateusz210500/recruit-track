import { inject, InjectionToken } from '@angular/core';

import { MockApiSettingsService } from '../mock-api/mock-api-settings.service';

export interface MockApiConfig {
  latencyMs: number;
  errorRate: number;
  storageKey: string;
}

export const DEFAULT_MOCK_API_CONFIG: MockApiConfig = {
  latencyMs: 600,
  errorRate: 0.05,
  storageKey: 'recruit-track:applications',
};

export const MOCK_API_CONFIG = new InjectionToken<MockApiConfig>(
  'MOCK_API_CONFIG',
  {
    providedIn: 'root',
    factory: () => inject(MockApiSettingsService).config(),
  },
);
