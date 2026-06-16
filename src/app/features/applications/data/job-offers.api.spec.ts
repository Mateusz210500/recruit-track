import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { provideApiConfig } from '../../../core/api/provide-api.config';
import { JobOffersApi } from './job-offers.api';

describe('JobOffersApi', () => {
  let api: JobOffersApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideApiConfig(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    api = TestBed.inject(JobOffersApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('extracts job offer fields from a URL', () => {
    const response = {
      company: 'Acme',
      role: 'Engineer',
      salary: '15 000 PLN',
      techStack: ['Angular'],
      notes: 'Remote',
      url: 'https://example.com/jobs/1',
    };

    api.extract('https://example.com/jobs/1').subscribe((result) => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne('/api/job-offers/extract');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ url: 'https://example.com/jobs/1' });
    req.flush(response);
  });
});
