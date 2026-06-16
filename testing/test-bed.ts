import { EnvironmentProviders, Provider, Type } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { provideApiConfig } from '../src/app/core/api/provide-api.config';
import { ApplicationsApi } from '../src/app/features/applications/data/applications.api';

export function provideTestHttp(): (Provider | EnvironmentProviders)[] {
  return [provideApiConfig(), provideHttpClient()];
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
