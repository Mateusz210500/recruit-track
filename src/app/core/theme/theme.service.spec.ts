import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let documentRef: Document;

  beforeEach(() => {
    localStorage.clear();
    documentRef = document;
    documentRef.documentElement.classList.remove('dark');

    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    documentRef.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('applies dark class when theme is dark', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    TestBed.flushEffects();

    expect(service.theme()).toBe('dark');
    expect(documentRef.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('recruit-track-theme')).toBe('dark');
  });

  it('removes dark class when theme is light', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    TestBed.flushEffects();
    service.setTheme('light');
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(documentRef.documentElement.classList.contains('dark')).toBe(false);
  });
});
