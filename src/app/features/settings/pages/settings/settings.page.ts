import { Component } from '@angular/core';

import { IconComponent } from '../../../../shared/icons';

@Component({
  selector: 'app-settings-page',
  imports: [IconComponent],
  template: `
    <section
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm"
      aria-labelledby="settings-heading"
    >
      <div
        class="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-600"
        aria-hidden="true"
      >
        <app-icon name="settings-cog" class="size-7" strokeWidth="1.5" />
      </div>
      <h1 id="settings-heading" class="text-2xl font-semibold text-slate-900">Settings</h1>
      <p class="mt-2 max-w-md text-slate-600">
        Import, export, theme, and demo controls will be configured here in a later phase.
      </p>
    </section>
  `,
})
export class SettingsPage {}
