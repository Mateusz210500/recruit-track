import { Component, inject } from '@angular/core';

import { ApplicationService } from '../../data/application.service';
import { ActivityTimelineComponent } from './activity-timeline/activity-timeline.component';
import { DashboardStatCardsComponent } from './dashboard-stat-cards/dashboard-stat-cards.component';
import { StatusDistributionChartComponent } from './status-distribution-chart/status-distribution-chart.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    DashboardStatCardsComponent,
    StatusDistributionChartComponent,
    ActivityTimelineComponent,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-600">
          Overview of your pipeline, status distribution, and recent activity.
        </p>
      </header>

      @if (service.isLoading()) {
        <div
          class="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16"
          role="status"
          aria-live="polite"
        >
          <p class="text-sm text-slate-600">Loading dashboard…</p>
        </div>
      } @else if (service.error(); as loadError) {
        <div
          class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <p class="font-medium">Could not load dashboard</p>
          <p class="mt-1">{{ loadError.message }}</p>
          <button
            type="button"
            class="mt-3 rounded-md bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800"
            (click)="service.reload()"
          >
            Retry
          </button>
        </div>
      } @else {
        <div class="grid gap-4">
          <app-dashboard-stat-cards
            [totalCount]="service.totalCount()"
            [pipelineCount]="service.pipelineCount()"
            [counts]="service.counts()"
          />

          <div class="grid gap-4 xl:grid-cols-2">
            @defer (on viewport) {
              <app-status-distribution-chart [counts]="service.counts()" />
            } @placeholder (minimum 300ms) {
              <section
                class="h-[22rem] animate-pulse rounded-xl border border-slate-200 bg-slate-50"
                aria-hidden="true"
              ></section>
            }

            @defer (on idle) {
              <app-activity-timeline [items]="service.recentActivity()" />
            } @placeholder {
              <section
                class="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
                aria-hidden="true"
              ></section>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardPage {
  protected readonly service = inject(ApplicationService);
}
