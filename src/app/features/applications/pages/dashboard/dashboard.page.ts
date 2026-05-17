import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  template: `
    <section
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm"
      aria-labelledby="dashboard-heading"
    >
      <div
        class="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
        aria-hidden="true"
      >
        <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5M10 19V9M16 19v-6M22 19V3" />
        </svg>
      </div>
      <h1 id="dashboard-heading" class="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p class="mt-2 max-w-md text-slate-600">
        Stats, charts, and activity timeline will appear here in a later phase.
      </p>
    </section>
  `,
})
export class DashboardPage {}
