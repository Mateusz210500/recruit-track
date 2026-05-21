import { Component, effect, inject, input, model, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IconComponent } from '../../../../shared/icons';
import { APPLICATION_STATUSES, ApplicationStatus } from '../../data/application-status';
import {
  Application,
  CreateApplicationDto,
  UpdateApplicationDto,
} from '../../data/application.model';

const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const FIELD_CLASS =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400';

const LABEL_CLASS = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200';

@Component({
  selector: 'app-application-form',
  imports: [ReactiveFormsModule, IconComponent],
  template: `
    @if (open()) {
      <div
        class="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-slate-950/70"
        role="presentation"
        (click)="close()"
      >
        <aside
          class="flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:border-l dark:border-slate-700 dark:bg-slate-900 dark:shadow-2xl dark:shadow-black/40"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="dialogTitleId"
          (click)="$event.stopPropagation()"
        >
          <header
            class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700"
          >
            <h2 [id]="dialogTitleId" class="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {{ application() ? 'Edit application' : 'New application' }}
            </h2>
            <button
              type="button"
              class="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close form"
              (click)="close()"
            >
              <app-icon name="close" class="size-5" />
            </button>
          </header>

          <form
            class="flex flex-1 flex-col overflow-y-auto px-5 py-4"
            [formGroup]="form"
            (ngSubmit)="submit()"
          >
            <div class="space-y-4">
              <div>
                <label [class]="LABEL_CLASS" for="company">Company</label>
                <input
                  id="company"
                  type="text"
                  formControlName="company"
                  [class]="FIELD_CLASS"
                  autocomplete="organization"
                />
                @if (form.controls.company.touched && form.controls.company.hasError('required')) {
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400">Company is required.</p>
                }
                @if (form.controls.company.touched && form.controls.company.hasError('minlength')) {
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                    Company must be at least 2 characters.
                  </p>
                }
              </div>

              <div>
                <label [class]="LABEL_CLASS" for="role">Role</label>
                <input
                  id="role"
                  type="text"
                  formControlName="role"
                  [class]="FIELD_CLASS"
                  autocomplete="organization-title"
                />
                @if (form.controls.role.touched && form.controls.role.hasError('required')) {
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400">Role is required.</p>
                }
              </div>

              <div>
                <label [class]="LABEL_CLASS" for="status">Status</label>
                <select id="status" formControlName="status" [class]="FIELD_CLASS">
                  @for (status of statuses; track status) {
                    <option [value]="status">{{ statusLabels[status] }}</option>
                  }
                </select>
              </div>

              <div>
                <label [class]="LABEL_CLASS" for="techStack">Tech stack</label>
                <input
                  id="techStack"
                  type="text"
                  formControlName="techStack"
                  placeholder="Angular, TypeScript"
                  [class]="FIELD_CLASS"
                />
                <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Comma-separated list</p>
              </div>

              <div>
                <label [class]="LABEL_CLASS" for="salary">Salary (USD)</label>
                <input
                  id="salary"
                  type="number"
                  formControlName="salary"
                  min="0"
                  [class]="FIELD_CLASS"
                />
                @if (form.controls.salary.touched && form.controls.salary.hasError('min')) {
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400">Salary cannot be negative.</p>
                }
              </div>

              <div>
                <label [class]="LABEL_CLASS" for="appliedAt">Applied date</label>
                <input
                  id="appliedAt"
                  type="date"
                  formControlName="appliedAt"
                  [class]="FIELD_CLASS + ' dark:[color-scheme:dark]'"
                />
              </div>

              <div>
                <label [class]="LABEL_CLASS" for="url">Job posting URL</label>
                <input id="url" type="url" formControlName="url" [class]="FIELD_CLASS" />
                @if (form.controls.url.touched && form.controls.url.hasError('pattern')) {
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400">Enter a valid URL.</p>
                }
              </div>

              <div>
                <label [class]="LABEL_CLASS" for="notes">Notes</label>
                <textarea id="notes" rows="3" formControlName="notes" [class]="FIELD_CLASS"></textarea>
                @if (form.controls.notes.touched && form.controls.notes.hasError('maxlength')) {
                  <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                    Notes cannot exceed 2000 characters.
                  </p>
                }
              </div>
            </div>

            <footer class="mt-auto flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                type="submit"
                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                [disabled]="form.invalid"
              >
                {{ application() ? 'Save changes' : 'Add application' }}
              </button>
              <button
                type="button"
                class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
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

  protected readonly FIELD_CLASS = FIELD_CLASS;
  protected readonly LABEL_CLASS = LABEL_CLASS;
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
    const appliedAt = value.appliedAt ? new Date(value.appliedAt).toISOString() : null;
    const salary =
      value.salary === null || value.salary === undefined ? null : Number(value.salary);
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
