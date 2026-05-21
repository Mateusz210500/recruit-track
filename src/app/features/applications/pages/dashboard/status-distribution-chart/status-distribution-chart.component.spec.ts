import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { StatusDistributionChartComponent } from './status-distribution-chart.component';

describe('StatusDistributionChartComponent', () => {
  it('renders the chart section and canvas', async () => {
    const fixture = await setup();

    expect(fixture.nativeElement.textContent).toContain('Status distribution');
    expect(fixture.nativeElement.querySelector('canvas')).toBeTruthy();
  });
});

async function setup() {
  await TestBed.configureTestingModule({
    imports: [StatusDistributionChartComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(StatusDistributionChartComponent);
  fixture.componentRef.setInput('counts', {
    wishlist: 1,
    applied: 2,
    interview: 1,
    offer: 0,
    rejected: 1,
  });
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}
