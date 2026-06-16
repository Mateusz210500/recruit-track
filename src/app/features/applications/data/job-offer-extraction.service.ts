import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, timeout } from 'rxjs';

import { ApiError } from '../../../core/api-error';
import { ExtractedApplication } from './extracted-application.model';
import { normalizeJobUrl } from './extracted-application.mapper';
import { JobOffersApi } from './job-offers.api';

const EXTRACT_TIMEOUT_MS = 120_000;

type ExtractState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: ExtractedApplication }
  | { status: 'error'; error: ApiError };

@Injectable({ providedIn: 'root' })
export class JobOfferExtractionService {
  private readonly api = inject(JobOffersApi);
  private readonly state = signal<ExtractState>({ status: 'idle' });

  readonly isExtracting = computed(() => this.state().status === 'loading');

  readonly extractError = computed(() => {
    const current = this.state();
    return current.status === 'error' ? current.error : null;
  });

  readonly extractedData = computed(() => {
    const current = this.state();
    return current.status === 'success' ? current.data : null;
  });

  extract(url: string): void {
    this.state.set({ status: 'loading' });

    this.api
      .extract(normalizeJobUrl(url))
      .pipe(
        timeout(EXTRACT_TIMEOUT_MS),
        catchError((error) => {
          this.state.set({ status: 'error', error: ApiError.from(error) });
          return EMPTY;
        }),
      )
      .subscribe((data) => {
        this.state.set({ status: 'success', data });
      });
  }

  reset(): void {
    this.state.set({ status: 'idle' });
  }
}
