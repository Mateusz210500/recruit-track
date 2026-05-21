import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, computed, input, output } from '@angular/core';

import { APPLICATION_STATUS_META, ApplicationStatus } from '../../../data/application-status';
import { Application } from '../../../data/application.model';
import { ApplicationCardComponent } from '../../../ui/application-card/application-card.component';

const COLUMN_HEADER_CLASSES: Record<ApplicationStatus, string> = {
  wishlist: 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800',
  applied: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/60',
  interview: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/60',
  offer: 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/60',
  rejected: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60',
};

@Component({
  selector: 'app-kanban-column',
  host: { class: 'flex min-w-62 flex-1 basis-0', style: 'height: max-content;' },
  imports: [DragDropModule, ApplicationCardComponent],
  template: `
    <section
      class="flex h-full min-h-80 w-full flex-col rounded-xl border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/70"
      [attr.aria-label]="columnLabel() + ' column'"
    >
      <header
        class="flex items-center justify-between rounded-t-xl border-b px-3 py-2"
        [class]="headerClass()"
      >
        <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ columnLabel() }}</h2>
        <span
          class="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-950/80 dark:text-slate-300"
        >
          {{ applications().length }}
        </span>
      </header>

      <div
        cdkDropList
        class="flex flex-1 flex-col gap-2 p-2"
        [id]="dropListId()"
        [cdkDropListData]="status()"
        (cdkDropListDropped)="dropped.emit($event)"
      >
        @for (application of applications(); track application.id) {
          <app-application-card [application]="application" (edit)="editApplication.emit($event)" />
        } @empty {
          <p
            class="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400"
          >
            Drop applications here
          </p>
        }
      </div>
    </section>
  `,
})
export class KanbanColumnComponent {
  readonly status = input.required<ApplicationStatus>();
  readonly applications = input.required<Application[]>();
  readonly dropListId = input.required<string>();

  readonly dropped = output<CdkDragDrop<ApplicationStatus>>();
  readonly editApplication = output<Application>();

  readonly columnLabel = computed(() => APPLICATION_STATUS_META[this.status()].label);

  readonly headerClass = computed(() => COLUMN_HEADER_CLASSES[this.status()]);
}
