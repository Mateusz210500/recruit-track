import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';

import {
  Application,
  CreateApplicationDto,
  MoveApplicationDto,
  UpdateApplicationDto,
} from '../../features/applications/data/application.model';
import { seedApplications } from '../../features/applications/data/seed-applications';
import { ApplicationStatus } from '../../features/applications/data/application-status';
import { clone } from '../utils/clone';
import { createId } from '../utils/id';
import { MOCK_API_CONFIG } from './mock-api.config';

interface ApplicationsRoute {
  id?: string;
  action?: 'move';
}

function parseApplicationsRoute(url: string): ApplicationsRoute | null {
  const path = url.split('?')[0] ?? url;
  if (!path.startsWith('/api/applications')) {
    return null;
  }

  const suffix = path.slice('/api/applications'.length);
  if (suffix === '' || suffix === '/') {
    return {};
  }

  const parts = suffix.split('/').filter(Boolean);
  if (parts.length === 1) {
    return { id: parts[0] };
  }

  if (parts.length === 2 && parts[1] === 'move') {
    return { id: parts[0], action: 'move' };
  }

  return null;
}

function readCollection(storageKey: string): Application[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    const seeded = seedApplications();
    localStorage.setItem(storageKey, JSON.stringify(seeded));
    return clone(seeded);
  }

  return JSON.parse(raw) as Application[];
}

function writeCollection(storageKey: string, apps: Application[]): void {
  localStorage.setItem(storageKey, JSON.stringify(apps));
}

function renumberStatus(apps: Application[], status: ApplicationStatus): void {
  apps
    .filter((app) => app.status === status)
    .sort((a, b) => a.order - b.order)
    .forEach((app, index) => {
      app.order = index;
    });
}

function findApplication(
  apps: Application[],
  id: string,
): { app: Application; index: number } {
  const index = apps.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: { message: `Application ${id} not found` },
    });
  }

  return { app: apps[index]!, index };
}

function createApplication(
  apps: Application[],
  dto: CreateApplicationDto,
): Application {
  const status = dto.status ?? 'wishlist';
  const maxOrder = apps
    .filter((app) => app.status === status)
    .reduce((max, app) => Math.max(max, app.order), -1);
  const now = new Date().toISOString();

  return {
    id: createId(),
    company: dto.company,
    role: dto.role,
    status,
    order: maxOrder + 1,
    appliedAt: dto.appliedAt ?? null,
    salary: dto.salary ?? null,
    techStack: dto.techStack ?? [],
    notes: dto.notes ?? '',
    url: dto.url ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

function updateApplication(
  apps: Application[],
  id: string,
  patch: UpdateApplicationDto,
): Application {
  const { app, index } = findApplication(apps, id);
  const previousStatus = app.status;
  const updated: Application = {
    ...app,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  apps[index] = updated;

  if (patch.status && patch.status !== previousStatus) {
    renumberStatus(apps, previousStatus);
    renumberStatus(apps, patch.status);
  }

  return updated;
}

function moveApplication(
  apps: Application[],
  id: string,
  dto: MoveApplicationDto,
): Application {
  const { app } = findApplication(apps, id);
  const previousStatus = app.status;

  app.status = dto.status;
  app.updatedAt = new Date().toISOString();

  const targetColumn = apps
    .filter((item) => item.status === dto.status)
    .sort((a, b) => a.order - b.order);
  const currentIndex = targetColumn.findIndex((item) => item.id === id);
  if (currentIndex !== -1) {
    targetColumn.splice(currentIndex, 1);
  }

  const clampedIndex = Math.max(0, Math.min(dto.index, targetColumn.length));
  targetColumn.splice(clampedIndex, 0, app);
  targetColumn.forEach((item, order) => {
    item.order = order;
  });

  if (previousStatus !== dto.status) {
    renumberStatus(apps, previousStatus);
  }

  return app;
}

function removeApplication(apps: Application[], id: string): void {
  const { app, index } = findApplication(apps, id);
  apps.splice(index, 1);
  renumberStatus(apps, app.status);
}

function handleRequest(
  method: string,
  route: ApplicationsRoute,
  body: unknown,
  storageKey: string,
): unknown {
  const apps = readCollection(storageKey);

  if (!route.id) {
    if (method === 'GET') {
      return apps.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }

    if (method === 'POST') {
      const created = createApplication(apps, body as CreateApplicationDto);
      apps.push(created);
      writeCollection(storageKey, apps);
      return created;
    }
  }

  if (route.id && route.action === 'move' && method === 'PATCH') {
    const moved = moveApplication(
      apps,
      route.id,
      body as MoveApplicationDto,
    );
    writeCollection(storageKey, apps);
    return moved;
  }

  if (route.id && method === 'GET') {
    return findApplication(apps, route.id).app;
  }

  if (route.id && method === 'PATCH') {
    const updated = updateApplication(
      apps,
      route.id,
      body as UpdateApplicationDto,
    );
    writeCollection(storageKey, apps);
    return updated;
  }

  if (route.id && method === 'DELETE') {
    removeApplication(apps, route.id);
    writeCollection(storageKey, apps);
    return null;
  }

  throw new HttpErrorResponse({
    status: 405,
    statusText: 'Method Not Allowed',
  });
}

function simulateError(
  config: { latencyMs: number; errorRate: number },
): Observable<never> {
  return of(null).pipe(
    delay(config.latencyMs),
    switchMap(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error',
            error: { message: 'Simulated server error' },
          }),
      ),
    ),
  );
}

function respond<T>(
  body: T,
  config: { latencyMs: number },
  status = 200,
): Observable<HttpEvent<T>> {
  return of(new HttpResponse({ body, status })).pipe(delay(config.latencyMs));
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const route = parseApplicationsRoute(req.url);
  if (!route) {
    return next(req);
  }

  const config = inject(MOCK_API_CONFIG);

  if (config.errorRate > 0 && Math.random() < config.errorRate) {
    return simulateError(config);
  }

  try {
    const body = handleRequest(req.method, route, req.body, config.storageKey);
    return respond(body, config);
  } catch (error) {
    if (error instanceof HttpErrorResponse) {
      return of(null).pipe(
        delay(config.latencyMs),
        switchMap(() => throwError(() => error)),
      );
    }

    return throwError(() => error);
  }
};
