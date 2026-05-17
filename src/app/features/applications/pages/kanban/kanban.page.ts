import { Component } from '@angular/core';

@Component({
  selector: 'app-kanban-page',
  template: `
    <section
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm"
      aria-labelledby="kanban-heading"
    >
      <div
        class="mb-4 flex size-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
        aria-hidden="true"
      >
        <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="5" height="18" rx="1" />
          <rect x="10" y="3" width="5" height="12" rx="1" />
          <rect x="17" y="3" width="5" height="15" rx="1" />
        </svg>
      </div>
      <h1 id="kanban-heading" class="text-2xl font-semibold text-slate-900">Kanban board</h1>
      <p class="mt-2 max-w-md text-slate-600">
        Drag applications across status columns. This view will be built in the next phase.
      </p>
    </section>
  `,
})
export class KanbanPage {}
