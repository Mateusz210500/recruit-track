import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';

import { provideTestMockApi } from '../../../../../../testing/test-bed';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows loading then renders stat cards', async () => {
    const fixture = await setup();
    expect(fixture.nativeElement.textContent).toContain('Loading dashboard');

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Total applications');
    expect(fixture.nativeElement.querySelector('app-dashboard-stat-cards')).toBeTruthy();
  });

  it('renders deferred placeholders for chart and timeline', async () => {
    const fixture = await setup();
    await fixture.whenStable();
    fixture.detectChanges();

    const placeholders = fixture.nativeElement.querySelectorAll(
      'section[aria-hidden="true"]',
    );
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [DashboardPage],
    providers: [provideRouter([]), ...provideTestMockApi()],
  }).compileComponents();

  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  return fixture;
}
