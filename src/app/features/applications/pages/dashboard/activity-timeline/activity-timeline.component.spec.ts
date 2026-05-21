import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ActivityItem } from '../../../data/application-activity.model';
import { ActivityTimelineComponent } from './activity-timeline.component';

describe('ActivityTimelineComponent', () => {
  it('renders activity items with labels and status pills', async () => {
    const items: ActivityItem[] = [
      {
        id: 'a-updated',
        applicationId: 'a',
        company: 'Acme',
        role: 'Engineer',
        status: 'interview',
        type: 'updated',
        timestamp: '2026-05-10T12:00:00.000Z',
      },
    ];

    const fixture = await setup(items);
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Recent activity');
    expect(text).toContain('Updated application');
    expect(text).toContain('Acme');
    expect(text).toContain('Engineer');
    expect(text).toContain('Interview');
  });

  it('shows an empty state when there is no activity', async () => {
    const fixture = await setup([]);
    expect(fixture.nativeElement.textContent).toContain('No activity yet');
  });
});

async function setup(items: ActivityItem[]) {
  await TestBed.configureTestingModule({
    imports: [ActivityTimelineComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(ActivityTimelineComponent);
  fixture.componentRef.setInput('items', items);
  fixture.detectChanges();
  return fixture;
}
