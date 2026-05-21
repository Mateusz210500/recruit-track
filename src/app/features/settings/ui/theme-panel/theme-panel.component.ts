import { Component, inject } from '@angular/core';

import { ThemeMode, ThemeService } from '../../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-panel',
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      aria-labelledby="theme-heading"
    >
      <h2 id="theme-heading" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Appearance
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Choose light or dark mode. Your preference is saved on this device.
      </p>

      <div class="mt-4 inline-flex rounded-lg border border-slate-200 p-1 dark:border-slate-700" role="group" aria-label="Theme">
        @for (option of options; track option.value) {
          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            [class.bg-indigo-600]="themeService.theme() === option.value"
            [class.text-white]="themeService.theme() === option.value"
            [class.text-slate-700]="themeService.theme() !== option.value"
            [class.dark:text-slate-200]="themeService.theme() !== option.value"
            [attr.aria-pressed]="themeService.theme() === option.value"
            (click)="setTheme(option.value)"
          >
            {{ option.label }}
          </button>
        }
      </div>
    </section>
  `,
})
export class ThemePanelComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly options: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  setTheme(theme: ThemeMode): void {
    this.themeService.setTheme(theme);
  }
}
