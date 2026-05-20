import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a toast and dismisses it manually', () => {
    const id = service.show('Saved', 'success');

    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0]?.message).toBe('Saved');

    service.dismiss(id);
    expect(service.toasts()).toHaveLength(0);
  });

  it('auto-dismisses toasts after the configured delay', () => {
    service.show('Failed', 'error');

    expect(service.toasts()).toHaveLength(1);

    vi.advanceTimersByTime(5_000);
    expect(service.toasts()).toHaveLength(0);
  });
});
