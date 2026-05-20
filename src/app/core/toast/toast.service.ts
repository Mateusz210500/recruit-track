import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'error' | 'success' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

const AUTO_DISMISS_MS = 5_000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly items = signal<Toast[]>([]);
  private readonly dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = this.items.asReadonly();

  show(message: string, variant: ToastVariant = 'info'): string {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, variant };

    this.items.update((current) => [...current, toast]);
    this.scheduleDismiss(id);

    return id;
  }

  dismiss(id: string): void {
    const timer = this.dismissTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.dismissTimers.delete(id);
    }

    this.items.update((current) => current.filter((toast) => toast.id !== id));
  }

  private scheduleDismiss(id: string): void {
    const timer = setTimeout(() => this.dismiss(id), AUTO_DISMISS_MS);
    this.dismissTimers.set(id, timer);
  }
}
