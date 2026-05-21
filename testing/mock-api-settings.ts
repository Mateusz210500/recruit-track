import { EnvironmentProviders, Provider } from '@angular/core';

import { MockApiSettingsService } from '../src/app/core/mock-api/mock-api-settings.service';
import {
  DEFAULT_MOCK_API_CONFIG,
  MockApiConfig,
} from '../src/app/core/interceptors/mock-api.config';

export function provideTestMockApiSettings(
  overrides: Partial<MockApiConfig> = {},
): Provider {
  const config: MockApiConfig = {
    ...DEFAULT_MOCK_API_CONFIG,
    latencyMs: 0,
    errorRate: 0,
    storageKey: `test-${crypto.randomUUID()}`,
    ...overrides,
  };

  return {
    provide: MockApiSettingsService,
    useFactory: () => {
      const settings = new MockApiSettingsService();
      settings.setLatencyMs(config.latencyMs);
      settings.setErrorRate(config.errorRate);
      settings.setStorageKey(config.storageKey);
      return settings;
    },
  };
}

export type TestMockApiProviders = (Provider | EnvironmentProviders)[];
