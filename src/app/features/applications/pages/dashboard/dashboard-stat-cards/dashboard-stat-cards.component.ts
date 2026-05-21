import { Component, computed, input } from '@angular/core';

import { ApplicationStatus } from '../../../data/application-status';

export interface DashboardStatCard {
  label: string;
  value: number;
  description: string;
}

@Component({
  selector: 'app-dashboard-stat-cards',
  template: `
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="list">
      @for (card of cards(); track card.label) {
        <article
          role="listitem"
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p class="text-sm font-medium text-slate-600">{{ card.label }}</p>
          <p class="mt-2 text-3xl font-semibold text-slate-900">{{ card.value }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ card.description }}</p>
        </article>
      }
    </div>
  `,
})
export class DashboardStatCardsComponent {
  readonly totalCount = input.required<number>();
  readonly pipelineCount = input.required<number>();
  readonly counts = input.required<Record<ApplicationStatus, number>>();

  readonly cards = computed<DashboardStatCard[]>(() => {
    const counts = this.counts();

    return [
      {
        label: 'Total applications',
        value: this.totalCount(),
        description: 'All tracked opportunities',
      },
      {
        label: 'Active pipeline',
        value: this.pipelineCount(),
        description: 'Wishlist, applied, and interview stages',
      },
      {
        label: 'Offers',
        value: counts.offer,
        description: 'Applications in offer stage',
      },
      {
        label: 'Rejected',
        value: counts.rejected,
        description: 'Closed without an offer',
      },
    ];
  });
}
