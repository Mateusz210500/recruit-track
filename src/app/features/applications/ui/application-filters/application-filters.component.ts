import { Component, computed, inject } from '@angular/core';

import {
  ApplicationFilters,
  EMPTY_APPLICATION_FILTERS,
  hasActiveFilters,
} from '../../data/application-filters.model';
import { ApplicationService } from '../../data/application.service';

function parseTechStackInput(value: string): string[] {
  return value
    .split(',')
    .map((tech) => tech.trim())
    .filter(Boolean);
}

function techStackToInput(techStack: string[]): string {
  return techStack.join(', ');
}

@Component({
  selector: 'app-application-filters',
  template: `
    <section
      class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      aria-label="Application filters"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-sm font-semibold text-slate-900">Filters</h2>
        @if (hasActive()) {
          <button
            type="button"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            (click)="clearFilters()"
          >
            Clear all
          </button>
        }
      </div>

      <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600" for="filter-company">
            Company
          </label>
          <input
            id="filter-company"
            type="text"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Acme"
            [value]="filters().company"
            (input)="onCompanyInput($event)"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600" for="filter-tech">
            Tech stack
          </label>
          <input
            id="filter-tech"
            type="text"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Angular, TypeScript"
            [value]="techStackInput()"
            (input)="onTechStackInput($event)"
          />
        </div>

        <div>
          <span class="mb-1 block text-xs font-medium text-slate-600">Salary range</span>
          <div class="flex gap-2">
            <input
              type="number"
              min="0"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Min"
              [value]="filters().salaryMin ?? ''"
              (input)="onSalaryMinInput($event)"
            />
            <input
              type="number"
              min="0"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Max"
              [value]="filters().salaryMax ?? ''"
              (input)="onSalaryMaxInput($event)"
            />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600" for="filter-applied-after">
            Applied from
          </label>
          <input
            id="filter-applied-after"
            type="date"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            [value]="filters().appliedAfter ?? ''"
            (input)="onAppliedAfterInput($event)"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-slate-600" for="filter-applied-before">
            Applied to
          </label>
          <input
            id="filter-applied-before"
            type="date"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            [value]="filters().appliedBefore ?? ''"
            (input)="onAppliedBeforeInput($event)"
          />
        </div>
      </div>
    </section>
  `,
})
export class ApplicationFiltersComponent {
  private readonly service = inject(ApplicationService);

  protected readonly filters = this.service.filters;
  protected readonly hasActive = computed(() => hasActiveFilters(this.filters()));
  protected readonly techStackInput = computed(() =>
    techStackToInput(this.filters().techStack),
  );

  onCompanyInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchFilters({ company: value });
  }

  onTechStackInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchFilters({ techStack: parseTechStackInput(value) });
  }

  onSalaryMinInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.patchFilters({
      salaryMin: raw === '' ? null : Number(raw),
    });
  }

  onSalaryMaxInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.patchFilters({
      salaryMax: raw === '' ? null : Number(raw),
    });
  }

  onAppliedAfterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchFilters({ appliedAfter: value || null });
  }

  onAppliedBeforeInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchFilters({ appliedBefore: value || null });
  }

  clearFilters(): void {
    this.service.setFilters(EMPTY_APPLICATION_FILTERS);
  }

  private patchFilters(patch: Partial<ApplicationFilters>): void {
    this.service.setFilters({ ...this.filters(), ...patch });
  }
}
