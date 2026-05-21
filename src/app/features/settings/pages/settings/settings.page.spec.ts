import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';

import { provideTestMockApi } from '../../../../../../testing/test-bed';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders settings sections', async () => {
    const fixture = await setup();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Data import & export');
    expect(fixture.nativeElement.textContent).toContain('Appearance');
    expect(fixture.nativeElement.textContent).toContain('Mock API demo controls');
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [SettingsPage],
    providers: [provideRouter([]), ...provideTestMockApi()],
  }).compileComponents();

  return TestBed.createComponent(SettingsPage);
}
