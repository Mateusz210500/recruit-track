import {
  Component,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  APPLICATION_STATUSES,
  ApplicationStatus,
} from '../../data/application-status';
import {
  Application,
  CreateApplicationDto,
  UpdateApplicationDto,
} from '../../data/application.model';

const URL_PATTERN =
  /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

@Component({
  selector: 'app-application-form',
  imports: [ReactiveFormsModule],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
        role="presentation"
        (click)="close()"
      >
        <aside
          class="flex h-full w-full max-w-md flex-col bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="dialogTitleId"
          (click)="$event.stopPropagation()"
        >
          <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 [id]="dialogTitleId" class="text-lg font-semibold text-slate-900">
              {{ application() ? 'Edit application' : 'New application' }}
            </h2>
            <button
              type="button"
              class="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close form"
              (click)="close()"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          <form
            class="flex flex-1 flex-col overflow-y-auto px-5 py-4"
            [formGroup]="form"
            (ngSubmit)="submit()"
          >
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="company">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  formControlName="company"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autocomplete="organization"
                />
                @if (form.controls.company.touched && form.controls.company.hasError('required')) {
                  <p class="mt-1 text-xs text-red-600">Company is required.</p>
                }
                @if (form.controls.company.touched && form.controls.company.hasError('minlength')) {
                  <p class="mt-1 text-xs text-red-600">Company must be at least 2 characters.</p>
                }
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="role">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  formControlName="role"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autocomplete="organization-title"
                />
                @if (form.controls.role.touched && form.controls.role.hasError('required')) {
                  <p class="mt-1 text-xs text-red-600">Role is required.</p>
                }
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="status">
                  Status
                </label>
                <select
                  id="status"
                  formControlName="status"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  @for (status of statuses; track status) {
                    <option [value]="status">{{ statusLabels[status] }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="techStack">
                  Tech stack
                </label>
                <input
                  id="techStack"
                  type="text"
                  formControlName="techStack"
                  placeholder="Angular, TypeScript"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p class="mt-1 text-xs text-slate-500">Comma-separated list</p>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="salary">
                  Salary (USD)
                </label>
                <input
                  id="salary"
                  type="number"
                  formControlName="salary"
                  min="0"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                @if (form.controls.salary.touched && form.controls.salary.hasError('min')) {
                  <p class="mt-1 text-xs text-red-600">Salary cannot be negative.</p>
                }
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="appliedAt">
                  Applied date
                </label>
                <input
                  id="appliedAt"
                  type="date"
                  formControlName="appliedAt"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="url">
                  Job posting URL
                </label>
                <input
                  id="url"
                  type="url"
                  formControlName="url"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                @if (form.controls.url.touched && form.controls.url.hasError('pattern')) {
                  <p class="mt-1 text-xs text-red-600">Enter a valid URL.</p>
                }
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700" for="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  formControlName="notes"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                ></textarea>
                @if (form.controls.notes.touched && form.controls.notes.hasError('maxlength')) {
                  <p class="mt-1 text-xs text-red-600">Notes cannot exceed 2000 characters.</p>
                }
              </div>
            </div>

            <footer class="mt-auto flex gap-2 border-t border-slate-200 pt-4">
              <button
                type="submit"
                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                [disabled]="form.invalid"
              >
                {{ application() ? 'Save changes' : 'Add application' }}
              </button>
              <button
                type="button"
                class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                (click)="close()"
              >
                Cancel
              </button>
            </footer>
          </form>
        </aside>
      </div>
    }
  `,
})
export class ApplicationFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly open = model(false);
  readonly application = input<Application | null>(null);

  readonly saveCreate = output<CreateApplicationDto>();
  readonly saveUpdate = output<{ id: string; patch: UpdateApplicationDto }>();
  readonly closed = output<void>();

  protected readonly dialogTitleId = 'application-form-title';
  protected readonly statuses = APPLICATION_STATUSES;
  protected readonly statusLabels: Record<ApplicationStatus, string> = {
    wishlist: 'Wishlist',
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
  };

  readonly form = this.fb.group({
    company: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', Validators.required],
    status: ['wishlist' as ApplicationStatus, Validators.required],
    techStack: [''],
    salary: this.fb.control<number | null>(null, Validators.min(0)),
    appliedAt: [''],
    url: ['', Validators.pattern(URL_PATTERN)],
    notes: ['', Validators.maxLength(2000)],
  });

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }

      const app = this.application();
      if (app) {
        this.form.reset({
          company: app.company,
          role: app.role,
          status: app.status,
          techStack: app.techStack.join(', '),
          salary: app.salary,
          appliedAt: app.appliedAt?.slice(0, 10) ?? '',
          url: app.url ?? '',
          notes: app.notes,
        });
        return;
      }

      this.form.reset({
        company: '',
        role: '',
        status: 'wishlist',
        techStack: '',
        salary: null,
        appliedAt: '',
        url: '',
        notes: '',
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const techStack = value.techStack
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const appliedAt = value.appliedAt
      ? new Date(value.appliedAt).toISOString()
      : null;
    const salary =
      value.salary === null || value.salary === undefined
        ? null
        : Number(value.salary);
    const url = value.url.trim() || null;

    const app = this.application();
    if (app) {
      this.saveUpdate.emit({
        id: app.id,
        patch: {
          company: value.company.trim(),
          role: value.role.trim(),
          status: value.status,
          techStack,
          salary,
          appliedAt,
          url,
          notes: value.notes.trim(),
        },
      });
    } else {
      this.saveCreate.emit({
        company: value.company.trim(),
        role: value.role.trim(),
        status: value.status,
        techStack,
        salary,
        appliedAt,
        url,
        notes: value.notes.trim(),
      });
    }

    this.close();
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
