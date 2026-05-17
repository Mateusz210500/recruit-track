import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { buildApplication } from '../../../../../../../testing/factories';
import { KanbanColumnComponent } from './kanban-column.component';

describe('KanbanColumnComponent', () => {
  it('renders the column label and application count', async () => {
    const fixture = await setup({
      applications: [
        buildApplication({ id: 'a' }),
        buildApplication({ id: 'b' }),
      ],
    });

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Applied');
    expect(element.textContent).toContain('2');
  });

  it('renders a card per application', async () => {
    const fixture = await setup({
      applications: [buildApplication({ company: 'Gamma' })],
    });

    expect(fixture.nativeElement.querySelectorAll('app-application-card').length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Gamma');
  });
});

async function setup(options: { applications: ReturnType<typeof buildApplication>[] }) {
  await TestBed.configureTestingModule({
    imports: [KanbanColumnComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(KanbanColumnComponent);
  fixture.componentRef.setInput('status', 'applied');
  fixture.componentRef.setInput('applications', options.applications);
  fixture.componentRef.setInput('dropListId', 'kanban-applied');
  fixture.detectChanges();
  return fixture;
}
