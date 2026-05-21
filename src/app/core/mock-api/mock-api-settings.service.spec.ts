import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { MockApiSettingsService } from './mock-api-settings.service';

describe('MockApiSettingsService', () => {
  it('updates latency and error rate in config()', () => {
    const service = TestBed.inject(MockApiSettingsService);

    service.setLatencyMs(1200);
    service.setErrorRate(0.25);

    expect(service.config()).toEqual({
      latencyMs: 1200,
      errorRate: 0.25,
      storageKey: 'recruit-track:applications',
    });
  });

  it('clamps latency to zero and error rate to 0..1', () => {
    const service = TestBed.inject(MockApiSettingsService);

    service.setLatencyMs(-50);
    service.setErrorRate(2);

    expect(service.latencyMs()).toBe(0);
    expect(service.errorRate()).toBe(1);
  });
});
