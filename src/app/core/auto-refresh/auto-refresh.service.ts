import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap, tap, timer } from 'rxjs';
import { ApplicationService } from '../../features/applications/data/application.service';

@Injectable({ providedIn: 'root' })
export class AutoRefreshService {
  private readonly interval = 30000;
  private readonly applicationService = inject(ApplicationService);
  readonly enabled = signal(false);

  constructor() {
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
