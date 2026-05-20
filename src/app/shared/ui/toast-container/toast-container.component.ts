import { Component, inject } from '@angular/core';

import { ToastService } from '../../../core/toast/toast.service';
import { IconComponent } from '../../icons';

@Component({
  selector: 'app-toast-container',
  imports: [IconComponent],
  template: `
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
      aria-live="polite"
      aria-relevant="additions"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg"
          [class]="variantClasses[toast.variant]"
          role="status"
        >
          <p class="min-w-0 flex-1">{{ toast.message }}</p>
          <button
            type="button"
            class="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            [attr.aria-label]="'Dismiss notification'"
            (click)="toastService.dismiss(toast.id)"
          >
            <app-icon name="close" class="size-4" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  protected readonly variantClasses: Record<
    'error' | 'success' | 'info',
    string
  > = {
    error: 'border-red-200 bg-red-50 text-red-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    info: 'border-slate-200 bg-white text-slate-900',
  };
}
