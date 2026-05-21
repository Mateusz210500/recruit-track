import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 dark:bg-slate-950/70"
        role="presentation"
        (click)="onCancel()"
      >
        <div
          class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          role="alertdialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="messageId"
          (click)="$event.stopPropagation()"
        >
          <h2 [id]="titleId" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {{ title() }}
          </h2>
          <p [id]="messageId" class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {{ message() }}
          </p>

          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              (click)="onCancel()"
            >
              {{ cancelLabel() }}
            </button>
            <button
              type="button"
              class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              (click)="onConfirm()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  readonly open = model(false);
  readonly title = input('Confirm');
  readonly message = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly titleId = `confirm-dialog-title-${crypto.randomUUID()}`;
  readonly messageId = `confirm-dialog-message-${crypto.randomUUID()}`;

  onConfirm(): void {
    this.confirmed.emit();
    this.open.set(false);
  }

  onCancel(): void {
    this.cancelled.emit();
    this.open.set(false);
  }
}
