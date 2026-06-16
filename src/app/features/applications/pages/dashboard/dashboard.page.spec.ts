import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';

import { provideInMemoryApplicationsApi } from '../../../../../../testing/in-memory-applications-api';
import { provideTestHttp } from '../../../../../../testing/test-bed';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders stat cards', async () => {
    const fixture = await setup();
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
    providers: [
      provideRouter([]),
      ...provideTestHttp(),
      provideInMemoryApplicationsApi(),
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(DashboardPage);
  fixture.detectChanges();
  return fixture;
}
