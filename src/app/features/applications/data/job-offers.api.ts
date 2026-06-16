import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/api/api.config';
import { ExtractedApplication } from './extracted-application.model';

@Injectable({ providedIn: 'root' })
export class JobOffersApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_BASE_URL).replace(/\/$/, '')}/api/job-offers`;

  extract(url: string): Observable<ExtractedApplication> {
    return this.http.post<ExtractedApplication>(`${this.baseUrl}/extract`, { url });
  }
}
