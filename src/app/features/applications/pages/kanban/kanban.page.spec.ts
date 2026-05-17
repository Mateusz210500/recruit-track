import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';

import { provideTestMockApi } from '../../../../../../testing/test-bed';
import { ApplicationService } from '../../data/application.service';
import { KanbanPage } from './kanban.page';

describe('KanbanPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows loading then renders kanban columns', async () => {
    const fixture = await setup();
    expect(fixture.nativeElement.textContent).toContain('Loading applications');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-kanban-column').length).toBe(5);
    expect(fixture.nativeElement.textContent).toContain('Kanban board');
  });

  it('opens the application form when add is clicked', async () => {
    const fixture = await setup();
    await fixture.whenStable();
    fixture.detectChanges();

    const addButton = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button: HTMLButtonElement) => button.textContent?.includes('Add application'),
    ) as HTMLButtonElement;
    addButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('reloads applications after creating one', async () => {
    const fixture = await setup();
    await fixture.whenStable();
    fixture.detectChanges();

    const service = TestBed.inject(ApplicationService);
    const initialCount = service.applications().length;

    service.create({ company: 'New Co', role: 'Dev' });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(service.applications().length).toBe(initialCount + 1);
    expect(service.applications().some((app) => app.company === 'New Co')).toBe(true);
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [KanbanPage],
    providers: [provideRouter([]), ...provideTestMockApi()],
  }).compileComponents();

  const fixture = TestBed.createComponent(KanbanPage);
  fixture.detectChanges();
  return fixture;
}
