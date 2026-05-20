import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { describe, expect, it, beforeEach } from 'vitest';

import { buildApplication } from '../../../../../testing/factories';
import { provideFakeApplicationsApi } from '../../../../../testing/test-bed';
import { ApiError } from '../../../core/api-error';
import { ToastService } from '../../../core/toast/toast.service';
import { EMPTY_APPLICATION_FILTERS } from './application-filters.model';
import { Application } from './application.model';
import { ApplicationsApi } from './applications.api';
import { ApplicationService } from './application.service';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let list$: Subject<Application[]>;

  beforeEach(() => {
    list$ = new Subject();

    TestBed.configureTestingModule({
      providers: [
        ApplicationService,
        provideFakeApplicationsApi({
          list: () => list$.asObservable(),
          create: () => of(buildApplication({ id: 'created' })),
          update: () => of(buildApplication({ id: 'updated' })),
          move: () => of(buildApplication({ id: 'moved' })),
          remove: () => of(void 0),
        }),
      ],
    });

    service = TestBed.inject(ApplicationService);
  });

  it('starts in loading state', () => {
    expect(service.isLoading()).toBe(true);
    expect(service.applications()).toEqual([]);
    expect(service.error()).toBeNull();
  });

  it('exposes applications after a successful load', () => {
    const apps = [buildApplication(), buildApplication({ id: 'app-2' })];
    list$.next(apps);
    list$.complete();

    expect(service.isLoading()).toBe(false);
    expect(service.applications()).toEqual(apps);
    expect(service.error()).toBeNull();
  });

  it('exposes ApiError after a failed load', () => {
    list$.error(
      new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      }),
    );

    expect(service.isLoading()).toBe(false);
    expect(service.applications()).toEqual([]);
    expect(service.error()).toBeInstanceOf(ApiError);
    expect(service.error()?.status).toBe(500);
  });

  it('computes applicationsByStatus and counts', () => {
    const apps = [
      buildApplication({ id: 'a', status: 'applied', order: 0 }),
      buildApplication({ id: 'b', status: 'applied', order: 1 }),
      buildApplication({ id: 'c', status: 'interview', order: 0 }),
    ];
    list$.next(apps);
    list$.complete();

    expect(service.applicationsByStatus().applied).toHaveLength(2);
    expect(service.applicationsByStatus().applied[0]?.id).toBe('a');
    expect(service.counts().applied).toBe(2);
    expect(service.counts().interview).toBe(1);
  });

  it('debounces search input before filtering', async () => {
    const apps = [
      buildApplication({ company: 'Alpha', role: 'Engineer' }),
      buildApplication({ id: 'b', company: 'Beta', role: 'Designer' }),
    ];
    list$.next(apps);
    list$.complete();

    service.setSearchInput('alpha');
    expect(service.searchQuery()).toBe('');
    expect(service.filtered()).toHaveLength(2);

    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(service.searchQuery()).toBe('alpha');
    expect(service.filtered()).toHaveLength(1);
    expect(service.filtered()[0]?.company).toBe('Alpha');
  });

  it('filters applications by structured criteria', () => {
    const apps = [
      buildApplication({
        company: 'Alpha',
        techStack: ['Angular'],
        salary: 130_000,
        appliedAt: '2026-02-01T00:00:00.000Z',
      }),
      buildApplication({
        id: 'b',
        company: 'Beta',
        techStack: ['React'],
        salary: 80_000,
        appliedAt: '2025-12-01T00:00:00.000Z',
      }),
    ];
    list$.next(apps);
    list$.complete();

    service.setFilters({
      ...EMPTY_APPLICATION_FILTERS,
      techStack: ['Angular'],
      salaryMin: 100_000,
      appliedAfter: '2026-01-01',
    });

    expect(service.filtered()).toHaveLength(1);
    expect(service.filtered()[0]?.company).toBe('Alpha');
    expect(service.filteredApplicationsByStatus().applied).toHaveLength(1);
  });

  it('shows a toast when a mutation fails', () => {
    const apps = [buildApplication({ id: 'a', status: 'applied', order: 0 })];
    list$.next(apps);
    list$.complete();

    const toast = TestBed.inject(ToastService);
    const api = TestBed.inject(ApplicationsApi);
    api.move = () =>
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' }));

    service.move('a', 'interview', 0);

    expect(toast.toasts()).toHaveLength(1);
    expect(toast.toasts()[0]?.variant).toBe('error');
    expect(toast.toasts()[0]?.message).toContain('Could not move application');
  });

  it('applies optimistic ordering while move is in flight', () => {
    const apps = [
      buildApplication({ id: 'a', status: 'applied', order: 0 }),
      buildApplication({ id: 'b', status: 'applied', order: 1 }),
      buildApplication({ id: 'c', status: 'interview', order: 0 }),
    ];
    list$.next(apps);
    list$.complete();

    const move$ = new Subject<Application>();
    const api = TestBed.inject(ApplicationsApi);
    api.move = () => move$.asObservable();

    service.move('a', 'interview', 1);

    expect(service.applicationsByStatus().interview.map((app) => app.id)).toEqual([
      'c',
      'a',
    ]);
  });

  it('rolls back optimistic ordering when move fails', () => {
    const apps = [
      buildApplication({ id: 'a', status: 'applied', order: 0 }),
      buildApplication({ id: 'b', status: 'applied', order: 1 }),
      buildApplication({ id: 'c', status: 'interview', order: 0 }),
    ];
    list$.next(apps);
    list$.complete();

    const api = TestBed.inject(ApplicationsApi);
    api.move = () => throwError(() => new HttpErrorResponse({ status: 500 }));

    service.move('a', 'interview', 1);

    expect(service.applicationsByStatus().interview.map((app) => app.id)).toEqual(['c']);
    expect(service.applicationsByStatus().applied.map((app) => app.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('reloads after create', () => {
    const initial = [buildApplication({ id: 'initial' })];
    const refreshed = [buildApplication({ id: 'refreshed' })];

    list$.next(initial);
    list$.complete();
    expect(service.applications()[0]?.id).toBe('initial');

    const reload$ = new Subject<Application[]>();
    const api = TestBed.inject(ApplicationsApi);
    api.list = () => reload$.asObservable();

    service.create({ company: 'New', role: 'Role' });
    reload$.next(refreshed);
    reload$.complete();

    expect(service.applications()).toEqual(refreshed);
  });
});
