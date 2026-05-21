import { Injectable, signal } from '@angular/core';

import {
  DEFAULT_MOCK_API_CONFIG,
  MockApiConfig,
} from '../interceptors/mock-api.config';

@Injectable({ providedIn: 'root' })
export class MockApiSettingsService {
  readonly latencyMs = signal(DEFAULT_MOCK_API_CONFIG.latencyMs);
  readonly errorRate = signal(DEFAULT_MOCK_API_CONFIG.errorRate);
  readonly storageKey = signal(DEFAULT_MOCK_API_CONFIG.storageKey);

  config(): MockApiConfig {
    return {
      latencyMs: this.latencyMs(),
      errorRate: this.errorRate(),
      storageKey: this.storageKey(),
    };
  }

  setLatencyMs(value: number): void {
    this.latencyMs.set(Math.max(0, Math.round(value)));
  }

  setErrorRate(value: number): void {
    this.errorRate.set(Math.min(1, Math.max(0, value)));
  }

  setStorageKey(value: string): void {
    this.storageKey.set(value);
  }
}
