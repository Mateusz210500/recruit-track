import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { describe, expect, it, beforeEach } from 'vitest';

import { buildApplication } from '../../../../../testing/factories';
import { provideFakeApplicationsApi } from '../../../../../testing/test-bed';
import { ApiError } from '../../../core/api-error';
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

  it('filters applications by query', () => {
    const apps = [
      buildApplication({ company: 'Alpha', role: 'Engineer' }),
      buildApplication({ id: 'b', company: 'Beta', role: 'Designer' }),
    ];
    list$.next(apps);
    list$.complete();

    service.setFilterQuery('alpha');

    expect(service.filtered()).toHaveLength(1);
    expect(service.filtered()[0]?.company).toBe('Alpha');
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
