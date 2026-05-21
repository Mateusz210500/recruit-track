import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
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
import { ToastService } from '../../../core/toast/toast.service';
import { filterApplicationsBySearch } from './application-search.utils';
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

const SEARCH_DEBOUNCE_MS = 200;

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly api = inject(ApplicationsApi);
  private readonly toast = inject(ToastService);
  private readonly refresh$ = new Subject<void>();
  private readonly optimisticApplications = signal<Application[] | null>(null);

  private readonly searchInputState = signal('');

  readonly searchInput = this.searchInputState.asReadonly();

  private readonly debouncedSearchQuery = toSignal(
    toObservable(this.searchInputState).pipe(
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

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

  readonly applicationsByStatus = computed(() =>
    this.groupByStatus(this.applications()),
  );

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

  readonly searchQuery = this.debouncedSearchQuery;

  readonly isSearching = computed(
    () => this.debouncedSearchQuery().trim().length > 0,
  );

  readonly filtered = computed(() =>
    filterApplicationsBySearch(
      this.applications(),
      this.debouncedSearchQuery(),
    ),
  );

  readonly filteredApplicationsByStatus = computed(() =>
    this.groupByStatus(this.filtered()),
  );

  constructor() {
    this.refresh$.next();
  }

  reload(): void {
    this.refresh$.next();
  }

  setSearchInput(query: string): void {
    this.searchInputState.set(query);
  }

  create(dto: CreateApplicationDto): void {
    this.api
      .create(dto)
      .pipe(
        tap(() => this.reload()),
        catchError((error) => this.handleMutationError('Could not create application', error)),
      )
      .subscribe();
  }

  update(id: string, patch: UpdateApplicationDto): void {
    this.api
      .update(id, patch)
      .pipe(
        tap(() => this.reload()),
        catchError((error) => this.handleMutationError('Could not update application', error)),
      )
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
        catchError((error) => {
          this.optimisticApplications.set(null);
          return this.handleMutationError('Could not move application', error);
        }),
      )
      .subscribe();
  }

  remove(id: string): void {
    this.api
      .remove(id)
      .pipe(
        tap(() => this.reload()),
        catchError((error) => this.handleMutationError('Could not delete application', error)),
      )
      .subscribe();
  }

  private groupByStatus(
    applications: Application[],
  ): Record<ApplicationStatus, Application[]> {
    const grouped = APPLICATION_STATUSES.reduce(
      (acc, status) => {
        acc[status] = [];
        return acc;
      },
      {} as Record<ApplicationStatus, Application[]>,
    );

    for (const application of applications) {
      grouped[application.status].push(application);
    }

    for (const status of APPLICATION_STATUSES) {
      grouped[status].sort((a, b) => a.order - b.order);
    }

    return grouped;
  }

  private handleMutationError(context: string, error: unknown) {
    const apiError = ApiError.from(error);
    this.toast.show(`${context}: ${apiError.message}`, 'error');
    return EMPTY;
  }
}
