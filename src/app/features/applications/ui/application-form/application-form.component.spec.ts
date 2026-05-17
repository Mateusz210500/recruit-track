import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { buildApplication } from '../../../../../../testing/factories';
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
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [ApplicationFormComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(ApplicationFormComponent);
  fixture.detectChanges();
  return fixture;
}
