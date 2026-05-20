import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';

import { APPLICATION_STATUSES, ApplicationStatus } from '../../data/application-status';
import { Application } from '../../data/application.model';
import { ApplicationService } from '../../data/application.service';
import { ApplicationFiltersComponent } from '../../ui/application-filters/application-filters.component';
import { ApplicationFormComponent } from '../../ui/application-form/application-form.component';
import { KanbanColumnComponent } from './kanban-column/kanban-column.component';

@Component({
  selector: 'app-kanban-page',
  imports: [
    DragDropModule,
    KanbanColumnComponent,
    ApplicationFormComponent,
    ApplicationFiltersComponent,
  ],
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
  template: `
    <div class="flex flex-col h-full">
      <header class="flex flex-wrap items-center justify-between gap-3 pb-6">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Kanban board</h1>
          <p class="mt-1 text-sm text-slate-600">
            Drag cards between columns to update application status.
          </p>
        </div>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          (click)="openCreateForm()"
        >
          Add application
        </button>
      </header>

      <app-application-filters class="mb-4 block" />

      @if (service.isFiltering()) {
        <p class="mb-4 text-sm text-slate-600" aria-live="polite">
          Showing {{ service.filtered().length }} of
          {{ service.applications().length }} applications
        </p>
      }

      @if (service.isLoading()) {
        <div
          class="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16"
          role="status"
          aria-live="polite"
        >
          <p class="text-sm text-slate-600">Loading applications…</p>
        </div>
      } @else if (service.error(); as loadError) {
        <div
          class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <p class="font-medium">Could not load applications</p>
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
        <div
          cdkDropListGroup
          class="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-4"
          aria-label="Application kanban board"
        >
          @for (status of statuses; track status) {
            <app-kanban-column
              [status]="status"
              [applications]="service.filteredApplicationsByStatus()[status]"
              [dropListId]="'kanban-' + status"
              (dropped)="onDrop($event)"
              (editApplication)="openEditForm($event)"
            />
          }
        </div>
      }

      <app-application-form
        [(open)]="formOpen"
        [application]="editingApplication()"
        (saveCreate)="service.create($event)"
        (saveUpdate)="onUpdate($event)"
      />
    </div>
  `,
})
export class KanbanPage {
  protected readonly service = inject(ApplicationService);
  protected readonly statuses = APPLICATION_STATUSES;

  protected readonly formOpen = signal(false);
  protected readonly editingApplication = signal<Application | null>(null);

  openCreateForm(): void {
    this.editingApplication.set(null);
    this.formOpen.set(true);
  }

  openEditForm(application: Application): void {
    this.editingApplication.set(application);
    this.formOpen.set(true);
  }

  onUpdate(event: { id: string; patch: Parameters<ApplicationService['update']>[1] }): void {
    this.service.update(event.id, event.patch);
  }

  onDrop(event: CdkDragDrop<ApplicationStatus>): void {
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) {
      return;
    }

    const application = event.item.data as Application;
    const targetStatus = event.container.data;
    this.service.move(application.id, targetStatus, event.currentIndex);
  }
}
