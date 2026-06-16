import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { provideApiConfig } from '../../../core/api/provide-api.config';
import { buildApplication } from '../../../../../testing/factories';
import { ApplicationsApi } from './applications.api';

describe('ApplicationsApi', () => {
  let api: ApplicationsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideApiConfig(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    api = TestBed.inject(ApplicationsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists applications', () => {
    const apps = [buildApplication()];

    api.list().subscribe((result) => {
      expect(result).toEqual(apps);
    });

    const req = httpMock.expectOne('/api/applications');
    expect(req.request.method).toBe('GET');
    req.flush(apps);
  });

  it('gets a single application', () => {
    const app = buildApplication({ id: 'app-42' });

    api.get('app-42').subscribe((result) => {
      expect(result).toEqual(app);
    });

    const req = httpMock.expectOne('/api/applications/app-42');
    expect(req.request.method).toBe('GET');
    req.flush(app);
  });

  it('creates an application', () => {
    const dto = { company: 'Acme', role: 'Engineer' };
    const created = buildApplication(dto);

    api.create(dto).subscribe((result) => {
      expect(result).toEqual(created);
    });

    const req = httpMock.expectOne('/api/applications');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(created);
  });

  it('updates an application', () => {
    const patch = { notes: 'Updated' };
    const updated = buildApplication(patch);

    api.update('app-1', patch).subscribe((result) => {
      expect(result).toEqual(updated);
    });

    const req = httpMock.expectOne('/api/applications/app-1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(patch);
    req.flush(updated);
  });

  it('moves an application', () => {
    const moved = buildApplication({ status: 'interview', order: 1 });

    api.move('app-1', 'interview', 1).subscribe((result) => {
      expect(result).toEqual(moved);
    });

    const req = httpMock.expectOne('/api/applications/app-1/move');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'interview', index: 1 });
    req.flush(moved);
  });

  it('removes an application', () => {
    api.remove('app-1').subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne('/api/applications/app-1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('replaces the full application collection', () => {
    const apps = [buildApplication({ id: 'bulk-1' })];

    api.replaceAll(apps).subscribe((result) => {
      expect(result).toEqual(apps);
    });

    const req = httpMock.expectOne('/api/applications');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(apps);
    req.flush(apps);
  });
});
