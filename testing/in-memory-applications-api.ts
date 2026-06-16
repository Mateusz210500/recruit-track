import { Provider } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Application, CreateApplicationDto, MoveApplicationDto, UpdateApplicationDto } from '../src/app/features/applications/data/application.model';
import { ApplicationsApi } from '../src/app/features/applications/data/applications.api';
import { buildApplication } from './factories';

function seedTestApplications(): Application[] {
  return [
    buildApplication({ id: 'seed-1', company: 'Vercel', status: 'wishlist', order: 0 }),
    buildApplication({ id: 'seed-2', company: 'Stripe', status: 'applied', order: 0 }),
    buildApplication({ id: 'seed-3', company: 'Linear', status: 'interview', order: 0 }),
    buildApplication({ id: 'seed-4', company: 'Figma', status: 'offer', order: 0 }),
    buildApplication({ id: 'seed-5', company: 'Acme Corp', status: 'rejected', order: 0 }),
  ];
}

export class InMemoryApplicationsApi {
  private apps = seedTestApplications();

  list(): Observable<Application[]> {
    return of(this.sortForList([...this.apps]));
  }

  get(id: string): Observable<Application> {
    const app = this.apps.find((item) => item.id === id);
    if (!app) {
      throw new Error(`Application ${id} not found`);
    }
    return of({ ...app });
  }

  create(dto: CreateApplicationDto): Observable<Application> {
    const status = dto.status ?? 'wishlist';
    const maxOrder = this.apps
      .filter((app) => app.status === status)
      .reduce((max, app) => Math.max(max, app.order), -1);
    const now = new Date().toISOString();
    const created = buildApplication({
      ...dto,
      id: crypto.randomUUID(),
      status,
      order: maxOrder + 1,
      techStack: dto.techStack ?? [],
      notes: dto.notes ?? '',
      url: dto.url ?? null,
      appliedAt: dto.appliedAt ?? null,
      salary: dto.salary ?? null,
      createdAt: now,
      updatedAt: now,
    });
    this.apps.push(created);
    return of(created);
  }

  update(id: string, patch: UpdateApplicationDto): Observable<Application> {
    const index = this.apps.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Application ${id} not found`);
    }
    const updated = {
      ...this.apps[index]!,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.apps[index] = updated;
    return of(updated);
  }

  move(id: string, status: MoveApplicationDto['status'], index: number): Observable<Application> {
    const app = this.apps.find((item) => item.id === id);
    if (!app) {
      throw new Error(`Application ${id} not found`);
    }
    app.status = status;
    app.order = index;
    app.updatedAt = new Date().toISOString();
    return of({ ...app });
  }

  remove(id: string): Observable<void> {
    this.apps = this.apps.filter((item) => item.id !== id);
    return of(void 0);
  }

  replaceAll(applications: Application[]): Observable<Application[]> {
    this.apps = applications.map((app) => ({ ...app }));
    return of(this.sortForList([...this.apps]));
  }

  private sortForList(apps: Application[]): Application[] {
    return apps.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
}

export function provideInMemoryApplicationsApi(): Provider {
  return {
    provide: ApplicationsApi,
    useFactory: () => new InMemoryApplicationsApi(),
  };
}
