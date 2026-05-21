import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it, beforeEach } from 'vitest';

import { buildApplication } from '../../../../testing/factories';
import { provideTestMockApi } from '../../../../testing/test-bed';
import { Application } from '../../features/applications/data/application.model';

describe('mockApiInterceptor', () => {
  let http: HttpClient;
  let storageKey: string;

  beforeEach(() => {
    storageKey = `test-${crypto.randomUUID()}`;
    localStorage.removeItem(storageKey);

    TestBed.configureTestingModule({
      providers: provideTestMockApi({ storageKey }),
    });

    http = TestBed.inject(HttpClient);
  });

  it('seeds and lists applications on first GET', async () => {
    const apps = await firstValueFrom(
      http.get<Application[]>('/api/applications'),
    );

    expect(apps.length).toBeGreaterThan(0);
    expect(localStorage.getItem(storageKey)).toBeTruthy();
  });

  it('creates, updates, moves, and deletes applications', async () => {
    const created = await firstValueFrom(
      http.post<Application>('/api/applications', {
        company: 'New Co',
        role: 'Staff Engineer',
        status: 'wishlist',
      }),
    );

    expect(created.company).toBe('New Co');
    expect(created.status).toBe('wishlist');

    const updated = await firstValueFrom(
      http.patch<Application>(`/api/applications/${created.id}`, {
        notes: 'Follow up next week',
      }),
    );

    expect(updated.notes).toBe('Follow up next week');

    const moved = await firstValueFrom(
      http.patch<Application>(`/api/applications/${created.id}/move`, {
        status: 'applied',
        index: 0,
      }),
    );

    expect(moved.status).toBe('applied');
    expect(moved.order).toBe(0);

    await firstValueFrom(
      http.delete<void>(`/api/applications/${created.id}`),
    );

    const remaining = await firstValueFrom(
      http.get<Application[]>('/api/applications'),
    );
    expect(remaining.some((app) => app.id === created.id)).toBe(false);
  });

  it('reads a pre-populated collection from storage', async () => {
    const seeded = [buildApplication({ id: 'seed-1', company: 'Stored Co' })];
    localStorage.setItem(storageKey, JSON.stringify(seeded));

    const apps = await firstValueFrom(
      http.get<Application[]>('/api/applications'),
    );

    expect(apps).toHaveLength(1);
    expect(apps[0]?.company).toBe('Stored Co');
  });

  it('returns 404 for unknown application id', async () => {
    await expect(
      firstValueFrom(http.get<Application>('/api/applications/unknown-id')),
    ).rejects.toMatchObject({ status: 404 });
  });

  it('replaces the collection with PUT', async () => {
    const replacement = [buildApplication({ id: 'bulk-1', company: 'Imported Co' })];

    const apps = await firstValueFrom(
      http.put<Application[]>('/api/applications', replacement),
    );

    expect(apps).toHaveLength(1);
    expect(apps[0]?.company).toBe('Imported Co');

    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as Application[];
    expect(stored).toHaveLength(1);
    expect(stored[0]?.company).toBe('Imported Co');
  });

  it('returns 500 when errorRate is forced to 1', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: provideTestMockApi({ storageKey, errorRate: 1 }),
    });

    const forcedErrorClient = TestBed.inject(HttpClient);

    await expect(
      firstValueFrom(forcedErrorClient.get('/api/applications')),
    ).rejects.toMatchObject({ status: 500 });
  });

});
