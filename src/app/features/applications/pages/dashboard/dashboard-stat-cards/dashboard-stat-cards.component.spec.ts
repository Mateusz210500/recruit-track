import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { DashboardStatCardsComponent } from './dashboard-stat-cards.component';

describe('DashboardStatCardsComponent', () => {
  it('renders stat card values from inputs', async () => {
    const fixture = await setup({
      totalCount: 12,
      pipelineCount: 8,
      counts: {
        wishlist: 2,
        applied: 4,
        interview: 2,
        offer: 3,
        rejected: 1,
      },
    });

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Total applications');
    expect(text).toContain('12');
    expect(text).toContain('Active pipeline');
    expect(text).toContain('8');
    expect(text).toContain('Offers');
    expect(text).toContain('3');
    expect(text).toContain('Rejected');
    expect(text).toContain('1');
  });
});

async function setup(options: {
  totalCount: number;
  pipelineCount: number;
  counts: Record<'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected', number>;
}) {
  await TestBed.configureTestingModule({
    imports: [DashboardStatCardsComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(DashboardStatCardsComponent);
  fixture.componentRef.setInput('totalCount', options.totalCount);
  fixture.componentRef.setInput('pipelineCount', options.pipelineCount);
  fixture.componentRef.setInput('counts', options.counts);
  fixture.detectChanges();
  return fixture;
}
