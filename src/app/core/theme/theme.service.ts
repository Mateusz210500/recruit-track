import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'recruit-track-theme';

function readStoredTheme(): ThemeMode | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function resolveInitialTheme(): ThemeMode {
  const stored = readStoredTheme();
  if (stored) {
    return stored;
  }

  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly mode = signal<ThemeMode>(resolveInitialTheme());

  readonly theme = this.mode.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.mode();
      const root = this.document.documentElement;
      root.classList.toggle('dark', theme === 'dark');

      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        /* ignore quota / private mode */
      }
    });
  }

  setTheme(theme: ThemeMode): void {
    this.mode.set(theme);
  }

  toggleTheme(): void {
    this.mode.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }
}
