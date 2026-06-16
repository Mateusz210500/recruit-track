import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/api/api.config';
import {
  Application,
  CreateApplicationDto,
  MoveApplicationDto,
  UpdateApplicationDto,
} from './application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_BASE_URL).replace(/\/$/, '')}/api/applications`;

  list(): Observable<Application[]> {
    return this.http.get<Application[]>(this.baseUrl);
  }

  get(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateApplicationDto): Observable<Application> {
    return this.http.post<Application>(this.baseUrl, dto);
  }

  update(id: string, patch: UpdateApplicationDto): Observable<Application> {
    return this.http.patch<Application>(`${this.baseUrl}/${id}`, patch);
  }

  move(id: string, status: MoveApplicationDto['status'], index: number): Observable<Application> {
    const body: MoveApplicationDto = { status, index };
    return this.http.patch<Application>(`${this.baseUrl}/${id}/move`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  replaceAll(applications: Application[]): Observable<Application[]> {
    return this.http.put<Application[]>(this.baseUrl, applications);
  }
}
