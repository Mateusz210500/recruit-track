import { Component, computed, input } from '@angular/core';

import {
  APPLICATION_STATUS_META,
  ApplicationStatus,
} from '../../data/application-status';

const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  wishlist: 'bg-slate-100 text-slate-700 ring-slate-200',
  applied: 'bg-blue-50 text-blue-700 ring-blue-200',
  interview: 'bg-amber-50 text-amber-800 ring-amber-200',
  offer: 'bg-green-50 text-green-700 ring-green-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
};

@Component({
  selector: 'app-status-pill',
  template: `
    <span
      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset"
      [class]="pillClass()"
    >
      {{ label() }}
    </span>
  `,
})
export class StatusPillComponent {
  readonly status = input.required<ApplicationStatus>();

  readonly label = computed(
    () => APPLICATION_STATUS_META[this.status()].label,
  );

  readonly pillClass = computed(() => STATUS_CLASSES[this.status()]);
}
