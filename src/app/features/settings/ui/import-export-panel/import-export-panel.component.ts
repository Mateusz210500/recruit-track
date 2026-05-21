import { Component, inject, model, signal } from '@angular/core';

import { ToastService } from '../../../../core/toast/toast.service';
import { parseApplicationsImport } from '../../../applications/data/application-import.utils';
import { Application } from '../../../applications/data/application.model';
import { ApplicationService } from '../../../applications/data/application.service';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-import-export-panel',
  imports: [ConfirmDialogComponent],
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      aria-labelledby="import-export-heading"
    >
      <h2 id="import-export-heading" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Data import &amp; export
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Export your applications as JSON or replace the full collection from a backup file.
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          [disabled]="service.isLoading() || service.applications().length === 0"
          (click)="exportApplications()"
        >
          Export JSON
        </button>

        <label
          class="inline-flex cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          [class.pointer-events-none]="service.isLoading()"
          [class.opacity-50]="service.isLoading()"
        >
          Import JSON
          <input
            type="file"
            accept="application/json,.json"
            class="sr-only"
            [disabled]="service.isLoading()"
            (change)="onFileSelected($event)"
          />
        </label>
      </div>

      @if (importError()) {
        <p class="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">{{ importError() }}</p>
      }
    </section>

    <app-confirm-dialog
      [(open)]="confirmOpen"
      title="Replace all applications?"
      [message]="confirmMessage()"
      confirmLabel="Replace data"
      (confirmed)="confirmImport()"
    />
  `,
})
export class ImportExportPanelComponent {
  private readonly toast = inject(ToastService);
  protected readonly service = inject(ApplicationService);

  protected readonly importError = signal<string | null>(null);
  protected readonly confirmOpen = model(false);
  protected readonly confirmMessage = signal('');
  private pendingImport: Application[] | null = null;

  exportApplications(): void {
    const applications = this.service.applications();
    const json = JSON.stringify(applications, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    anchor.href = url;
    anchor.download = `recruit-track-applications-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    this.toast.show(`Exported ${applications.length} applications`, 'success');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    this.importError.set(null);
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown;
        const result = parseApplicationsImport(parsed);

        if (!result.ok) {
          this.importError.set(result.error);
          return;
        }

        this.pendingImport = result.data;
        this.confirmMessage.set(
          `This will replace ${this.service.applications().length} existing applications with ${result.data.length} imported records.`,
        );
        this.confirmOpen.set(true);
      } catch {
        this.importError.set('Could not parse JSON file.');
      }
    };

    reader.onerror = () => {
      this.importError.set('Could not read the selected file.');
    };

    reader.readAsText(file);
  }

  confirmImport(): void {
    const applications = this.pendingImport;
    this.pendingImport = null;

    if (!applications) {
      return;
    }

    this.service.replaceAll(applications);
    this.toast.show(`Imported ${applications.length} applications`, 'success');
  }
}
