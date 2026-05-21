import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { ActivityItem } from '../../../data/application-activity.model';
import { StatusPillComponent } from '../../../ui/status-pill/status-pill.component';

const ACTIVITY_LABELS: Record<ActivityItem['type'], string> = {
  created: 'Added to tracker',
  applied: 'Marked as applied',
  updated: 'Updated application',
};

@Component({
  selector: 'app-activity-timeline',
  imports: [DatePipe, StatusPillComponent],
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-none"
      aria-labelledby="activity-timeline-heading"
    >
      <h2 id="activity-timeline-heading" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Recent activity
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Latest changes across your tracked applications.
      </p>

      @if (items().length === 0) {
        <p class="mt-6 text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
      } @else {
        <ol class="mt-4 space-y-4" aria-label="Recent application activity">
          @for (item of items(); track item.id) {
            <li class="flex gap-3 border-l-2 border-indigo-100 pl-4 dark:border-indigo-900">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {{ ACTIVITY_LABELS[item.type] }}
                </p>
                <p class="text-sm text-slate-600 dark:text-slate-300">
                  {{ item.company }} · {{ item.role }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <app-status-pill [status]="item.status" />
                  <time class="text-xs text-slate-500 dark:text-slate-400" [attr.datetime]="item.timestamp">
                    {{ item.timestamp | date: 'medium' }}
                  </time>
                </div>
              </div>
            </li>
          }
        </ol>
      }
    </section>
  `,
})
export class ActivityTimelineComponent {
  readonly items = input.required<ActivityItem[]>();

  protected readonly ACTIVITY_LABELS = ACTIVITY_LABELS;
}
