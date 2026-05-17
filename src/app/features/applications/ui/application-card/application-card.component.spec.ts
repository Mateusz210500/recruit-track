import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { buildApplication } from '../../../../../../testing/factories';
import { ApplicationCardComponent } from './application-card.component';

describe('ApplicationCardComponent', () => {
  it('renders company, role, and tech stack', async () => {
    const fixture = await setup({
      application: buildApplication({
        company: 'Acme',
        role: 'Frontend Engineer',
        techStack: ['Angular', 'RxJS'],
      }),
    });

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Acme');
    expect(element.textContent).toContain('Frontend Engineer');
    expect(element.textContent).toContain('Angular');
    expect(element.textContent).toContain('RxJS');
  });

  it('emits edit when the edit button is clicked', async () => {
    const application = buildApplication({ company: 'Beta Corp' });
    const fixture = await setup({ application });
    const editSpy = vi.fn();
    fixture.componentInstance.edit.subscribe(editSpy);

    const button = [...fixture.nativeElement.querySelectorAll('button')].find(
      (item: HTMLButtonElement) => item.textContent?.trim() === 'Edit',
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(editSpy).toHaveBeenCalledWith(application);
  });
});

async function setup(options: {
  application: ReturnType<typeof buildApplication>;
}) {
  await TestBed.configureTestingModule({
    imports: [ApplicationCardComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(ApplicationCardComponent);
  fixture.componentRef.setInput('application', options.application);
  fixture.detectChanges();
  return fixture;
}
