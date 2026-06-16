import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';

import { buildApplication } from '../../../../../../testing/factories';
import { ExtractedApplication } from '../../data/extracted-application.model';
import { JobOfferExtractionService } from '../../data/job-offer-extraction.service';
import { JobOffersApi } from '../../data/job-offers.api';
import { ApplicationFormComponent } from './application-form.component';

describe('ApplicationFormComponent', () => {
  it('does not render when closed', async () => {
    const fixture = await setup();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('shows validation errors for required fields', async () => {
    const fixture = await setup();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    fixture.componentInstance.submit();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('.text-red-600');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('emits saveCreate with parsed values on submit', async () => {
    const fixture = await setup();
    const createSpy = vi.fn();
    fixture.componentInstance.saveCreate.subscribe(createSpy);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({
      company: 'Acme',
      role: 'Engineer',
      status: 'applied',
      techStack: 'Angular, RxJS',
      salary: 120000,
      appliedAt: '2026-01-15',
      url: 'https://example.com/jobs/1',
      notes: 'Follow up next week',
    });

    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        company: 'Acme',
        role: 'Engineer',
        status: 'applied',
        techStack: ['Angular', 'RxJS'],
        salary: 120000,
        url: 'https://example.com/jobs/1',
        notes: 'Follow up next week',
      }),
    );
  });

  it('emits saveUpdate when editing an application', async () => {
    const fixture = await setup();
    const updateSpy = vi.fn();
    const application = buildApplication({ id: 'edit-me', company: 'Old' });
    fixture.componentInstance.saveUpdate.subscribe(updateSpy);
    fixture.componentRef.setInput('application', application);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    fixture.componentInstance.form.patchValue({
      company: 'New Corp',
      role: 'Staff Engineer',
    });
    fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(updateSpy).toHaveBeenCalledWith({
      id: 'edit-me',
      patch: expect.objectContaining({
        company: 'New Corp',
        role: 'Staff Engineer',
      }),
    });
  });

  it('auto-fills the form after extracting from a job URL', async () => {
    const extracted: ExtractedApplication = {
      company: 'Vercel',
      role: 'Frontend Engineer',
      salary: '180000',
      techStack: ['Next.js', 'React'],
      notes: 'Remote-friendly',
      url: 'https://example.com/jobs/vercel',
    };

    const fixture = await setup({
      extract: () => of(extracted),
    });
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    fixture.componentInstance.form.controls.url.setValue('https://example.com/jobs/vercel');
    fixture.componentInstance.extractFromUrl();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls.company.value).toBe('Vercel');
    expect(fixture.componentInstance.form.controls.role.value).toBe('Frontend Engineer');
    expect(fixture.componentInstance.form.controls.techStack.value).toBe('Next.js, React');
    expect(fixture.componentInstance.form.controls.salary.value).toBe(180000);
    expect(fixture.nativeElement.textContent).toContain('Fields auto-filled');
  });
});

async function setup(jobOffersApi: Partial<JobOffersApi> = {}) {
  await TestBed.configureTestingModule({
    imports: [ApplicationFormComponent],
    providers: [
      JobOfferExtractionService,
      { provide: JobOffersApi, useValue: jobOffersApi },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ApplicationFormComponent);
  fixture.detectChanges();
  return fixture;
}
