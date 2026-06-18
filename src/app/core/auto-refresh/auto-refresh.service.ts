import { effect, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap, tap, timer } from 'rxjs';
import { ApplicationService } from '../../features/applications/data/application.service';

const AUTO_REFRESH_STORAGE_KEY = 'recruit-track-auto-refresh';

function readStoredAutoRefresh(): boolean | null {
  try {
    const stored = localStorage.getItem(AUTO_REFRESH_STORAGE_KEY);
    return stored === 'true' ? true : false;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AutoRefreshService {
  private readonly interval = 30000;
  private readonly applicationService = inject(ApplicationService);
  readonly enabled = signal<boolean | null>(readStoredAutoRefresh() ?? false);

  constructor() {
    effect(() => {
      const enabled = this.enabled();
      try {
        localStorage.setItem(AUTO_REFRESH_STORAGE_KEY, enabled?.toString() ?? 'false');
      } catch {
        /* ignore quota / private mode */
      }
    });
    toObservable(this.enabled)
      .pipe(
        switchMap((on) => (on ? timer(this.interval, this.interval) : EMPTY)),
        tap(() => this.applicationService.reload()),
      )
      .subscribe();
  }

  setEnabled(enabled: boolean): void {
    this.enabled.set(enabled);
  }
}
