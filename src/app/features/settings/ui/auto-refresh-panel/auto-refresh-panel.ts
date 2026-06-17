import { Component, inject } from '@angular/core';
import { AutoRefreshService } from '../../../../core/auto-refresh/auto-refresh.service';

@Component({
  selector: 'app-auto-refresh-panel',
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      aria-labelledby="auto-refresh-heading"
    >
      <h2
        id="auto-refresh-heading"
        class="text-lg font-semibold text-slate-900 dark:text-slate-100"
      >
        Auto Refresh
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Automatically refresh the page every 30 seconds.
      </p>

      <div class="mt-4 flex items-center gap-3">
        <label class="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            class="peer sr-only"
            role="switch"
            [checked]="enabled()"
            [attr.aria-checked]="enabled()"
            (change)="setEnabled($any($event.target).checked)"
          />
          <span
            class="relative h-6 w-11 rounded-full bg-slate-200 transition-colors after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600 dark:bg-slate-700 dark:peer-checked:bg-indigo-500 dark:peer-focus-visible:outline-indigo-500"
            aria-hidden="true"
          ></span>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-200">
            {{ enabled() ? 'On' : 'Off' }}
          </span>
        </label>
      </div>
    </section>
  `,
})
export class AutoRefreshPanelComponent {
  protected readonly autoRefreshService = inject(AutoRefreshService);

  setEnabled(enabled: boolean): void {
    this.autoRefreshService.setEnabled(enabled);
  }

  protected readonly enabled = this.autoRefreshService.enabled.asReadonly();
}
