import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { IconComponent } from '../../../../shared/icons';
import { Application } from '../../data/application.model';
import { StatusPillComponent } from '../status-pill/status-pill.component';

@Component({
  selector: 'app-application-card',
  imports: [CdkDrag, CdkDragHandle, CurrencyPipe, DatePipe, StatusPillComponent, IconComponent],
  template: `
    <article
      cdkDrag
      [cdkDragData]="application()"
      class="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow active:cursor-grabbing hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500"
      [attr.aria-label]="application().company + ' — ' + application().role"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-slate-900">{{ application().company }}</h3>
          <p class="text-sm text-slate-600">{{ application().role }}</p>
        </div>
        <div class="flex items-start gap-1">
          <button
            type="button"
            cdkDragHandle
            class="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Drag to reorder"
          >
            <app-icon name="grip" class="size-4" />
          </button>
          <app-status-pill [status]="application().status" />
        </div>
      </div>

      @if (application().techStack.length > 0) {
        <ul class="mt-2 flex flex-wrap gap-1" aria-label="Tech stack">
          @for (tech of application().techStack; track tech) {
            <li
              class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
            >
              {{ tech }}
            </li>
          }
        </ul>
      }

      <dl class="mt-2 space-y-0.5 text-xs text-slate-500">
        @if (application().salary; as salary) {
          <div class="flex justify-between gap-2">
            <dt>Salary</dt>
            <dd>{{ salary | currency: 'USD' : 'symbol' : '1.0-0' }}</dd>
          </div>
        }
        @if (application().appliedAt; as appliedAt) {
          <div class="flex justify-between gap-2">
            <dt>Applied</dt>
            <dd>{{ appliedAt | date: 'mediumDate' }}</dd>
          </div>
        }
      </dl>

      <div class="mt-3 flex gap-2">
        <button
          type="button"
          class="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
          (click)="edit.emit(application()); $event.stopPropagation()"
        >
          Edit
        </button>
      </div>
    </article>
  `,
})
export class ApplicationCardComponent {
  readonly application = input.required<Application>();
  readonly edit = output<Application>();
}
