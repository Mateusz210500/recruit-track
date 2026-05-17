import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  map,
  merge,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { ApiError } from '../../../core/api-error';
import { applyMove } from './application-order';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
} from './application-status';
import {
  Application,
  CreateApplicationDto,
  UpdateApplicationDto,
} from './application.model';
import { ApplicationsApi } from './applications.api';

type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: Application[] }
  | { status: 'error'; error: ApiError };

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly api = inject(ApplicationsApi);
  private readonly refresh$ = new Subject<void>();
  private readonly optimisticApplications = signal<Application[] | null>(null);

  private readonly loadState = toSignal(
    merge(of(undefined), this.refresh$.pipe(map(() => undefined))).pipe(
      switchMap(() =>
        this.api.list().pipe(
          map(
            (data): LoadState => ({
              status: 'success',
              data,
            }),
          ),
          startWith({ status: 'loading' } satisfies LoadState),
          catchError((error) =>
            of({
              status: 'error',
              error: ApiError.from(error),
            } satisfies LoadState),
          ),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } satisfies LoadState },
  );

  readonly applications = computed(() => {
    const optimistic = this.optimisticApplications();
    if (optimistic) {
      return optimistic;
    }

    const state = this.loadState();
    return state.status === 'success' ? state.data : [];
  });

  readonly isLoading = computed(() => this.loadState().status === 'loading');

  readonly error = computed(() => {
    const state = this.loadState();
    return state.status === 'error' ? state.error : null;
  });

  readonly applicationsByStatus = computed(() => {
    const grouped = APPLICATION_STATUSES.reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      {} as Record<ApplicationStatus, Application[]>,
    );

    for (const application of this.applications()) {
      grouped[application.status].push(application);
    }

    for (const status of APPLICATION_STATUSES) {
      grouped[status].sort((a, b) => a.order - b.order);
    }

    return grouped;
  });

  readonly counts = computed(() =>
    APPLICATION_STATUSES.reduce(
      (acc, status) => {
        acc[status] = this.applications().filter(
          (application) => application.status === status,
        ).length;
        return acc;
      },
      {} as Record<ApplicationStatus, number>,
    ),
  );

  private readonly filterQuery = signal('');

  readonly filtered = computed(() => {
    const query = this.filterQuery().trim().toLowerCase();
    if (!query) {
      return this.applications();
    }

    return this.applications().filter((application) => {
      const haystack = [
        application.company,
        application.role,
        application.notes,
        ...application.techStack,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  });

  constructor() {
    this.refresh$.next();
  }

  reload(): void {
    this.refresh$.next();
  }

  setFilterQuery(query: string): void {
    this.filterQuery.set(query);
  }

  create(dto: CreateApplicationDto): void {
    this.api
      .create(dto)
      .pipe(tap(() => this.reload()))
      .subscribe();
  }

  update(id: string, patch: UpdateApplicationDto): void {
    this.api
      .update(id, patch)
      .pipe(tap(() => this.reload()))
      .subscribe();
  }

  move(id: string, status: ApplicationStatus, index: number): void {
    const snapshot = this.applications();
    this.optimisticApplications.set(
      applyMove(snapshot, id, status, index),
    );

    this.api
      .move(id, status, index)
      .pipe(
        tap(() => {
          this.optimisticApplications.set(null);
          this.reload();
        }),
        catchError(() => {
          this.optimisticApplications.set(null);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  remove(id: string): void {
    this.api
      .remove(id)
      .pipe(tap(() => this.reload()))
      .subscribe();
  }
}
