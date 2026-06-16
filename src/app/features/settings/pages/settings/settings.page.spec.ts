import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';

import { provideInMemoryApplicationsApi } from '../../../../../../testing/in-memory-applications-api';
import { provideTestHttp } from '../../../../../../testing/test-bed';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  it('renders settings sections', async () => {
    const fixture = await setup();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Data import & export');
    expect(fixture.nativeElement.textContent).toContain('Appearance');
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [SettingsPage],
    providers: [
      provideRouter([]),
      ...provideTestHttp(),
      provideInMemoryApplicationsApi(),
    ],
  }).compileComponents();

  return TestBed.createComponent(SettingsPage);
}
