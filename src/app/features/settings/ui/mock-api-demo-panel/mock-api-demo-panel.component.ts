import { Component, inject } from '@angular/core';

import { MockApiSettingsService } from '../../../../core/mock-api/mock-api-settings.service';

@Component({
  selector: 'app-mock-api-demo-panel',
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      aria-labelledby="mock-api-heading"
    >
      <h2 id="mock-api-heading" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Mock API demo controls
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Tune simulated latency and random server errors for demos and resilience testing.
      </p>

      <div class="mt-4 space-y-4">
        <div>
          <label class="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200" for="latency-slider">
            <span>Latency</span>
            <span class="tabular-nums text-slate-500 dark:text-slate-400">{{ settings.latencyMs() }} ms</span>
          </label>
          <input
            id="latency-slider"
            type="range"
            min="0"
            max="3000"
            step="50"
            class="mt-2 w-full accent-indigo-600"
            [value]="settings.latencyMs()"
            (input)="onLatencyInput($event)"
          />
        </div>

        <div>
          <label class="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200" for="error-rate-slider">
            <span>Error rate</span>
            <span class="tabular-nums text-slate-500 dark:text-slate-400">{{ errorRatePercent() }}%</span>
          </label>
          <input
            id="error-rate-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            class="mt-2 w-full accent-indigo-600"
            [value]="errorRatePercent()"
            (input)="onErrorRateInput($event)"
          />
        </div>
      </div>
    </section>
  `,
})
export class MockApiDemoPanelComponent {
  protected readonly settings = inject(MockApiSettingsService);

  protected errorRatePercent(): number {
    return Math.round(this.settings.errorRate() * 100);
  }

  onLatencyInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.settings.setLatencyMs(value);
  }

  onErrorRateInput(event: Event): void {
    const percent = Number((event.target as HTMLInputElement).value);
    this.settings.setErrorRate(percent / 100);
  }
}
