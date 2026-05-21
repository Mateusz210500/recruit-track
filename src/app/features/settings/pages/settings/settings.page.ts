import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../../core/theme/theme.service';
import { ImportExportPanelComponent } from '../../ui/import-export-panel/import-export-panel.component';
import { MockApiDemoPanelComponent } from '../../ui/mock-api-demo-panel/mock-api-demo-panel.component';
import { ThemePanelComponent } from '../../ui/theme-panel/theme-panel.component';

@Component({
  selector: 'app-settings-page',
  imports: [ImportExportPanelComponent, ThemePanelComponent, MockApiDemoPanelComponent],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Manage backups, appearance, and mock API behavior for demos.
        </p>
      </header>

      <div class="grid gap-4 lg:grid-cols-2">
        <app-import-export-panel class="lg:col-span-2" />
        <app-theme-panel />
        <app-mock-api-demo-panel />
      </div>
    </div>
  `,
})
export class SettingsPage {
  constructor() {
    inject(ThemeService);
  }
}
