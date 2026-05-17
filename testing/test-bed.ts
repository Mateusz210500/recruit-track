import { EnvironmentProviders, Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { mockApiInterceptor } from '../src/app/core/interceptors/mock-api.interceptor';
import {
  DEFAULT_MOCK_API_CONFIG,
  MOCK_API_CONFIG,
  MockApiConfig,
} from '../src/app/core/interceptors/mock-api.config';
import { ApplicationsApi } from '../src/app/features/applications/data/applications.api';

export function provideTestMockApi(
  overrides: Partial<MockApiConfig> = {},
): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: MOCK_API_CONFIG,
      useValue: {
        ...DEFAULT_MOCK_API_CONFIG,
        latencyMs: 0,
        errorRate: 0,
        storageKey: `test-${crypto.randomUUID()}`,
        ...overrides,
      },
    },
    provideHttpClient(withInterceptors([mockApiInterceptor])),
  ];
}

export function provideFakeApplicationsApi(
  fake: Partial<ApplicationsApi>,
): Provider {
  return { provide: ApplicationsApi, useValue: fake };
}

export async function renderWithProviders<T>(
  component: Type<T>,
  options: { providers?: (Provider | EnvironmentProviders)[] } = {},
) {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: options.providers ?? [],
  }).compileComponents();

  return TestBed.createComponent(component);
}
