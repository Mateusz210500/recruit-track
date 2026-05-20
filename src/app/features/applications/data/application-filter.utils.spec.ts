import { describe, expect, it } from 'vitest';

import { buildApplication } from '../../../../../testing/factories';
import { EMPTY_APPLICATION_FILTERS } from './application-filters.model';
import {
  filterApplications,
  matchesApplicationFilters,
  matchesSearchQuery,
} from './application-filter.utils';

describe('application filter utils', () => {
  const base = buildApplication({
    company: 'Acme Corp',
    role: 'Frontend Engineer',
    techStack: ['Angular', 'TypeScript'],
    salary: 120_000,
    appliedAt: '2026-03-15T00:00:00.000Z',
  });

  it('matches search query across company, role, notes, and tech stack', () => {
    expect(matchesSearchQuery(base, 'acme')).toBe(true);
    expect(matchesSearchQuery(base, 'angular')).toBe(true);
    expect(matchesSearchQuery(base, 'designer')).toBe(false);
    expect(matchesSearchQuery(base, '')).toBe(true);
  });

  it('filters by company, tech stack, salary, and applied date', () => {
    expect(
      matchesApplicationFilters(base, {
        ...EMPTY_APPLICATION_FILTERS,
        company: 'acme',
      }),
    ).toBe(true);

    expect(
      matchesApplicationFilters(base, {
        ...EMPTY_APPLICATION_FILTERS,
        techStack: ['React'],
      }),
    ).toBe(false);

    expect(
      matchesApplicationFilters(base, {
        ...EMPTY_APPLICATION_FILTERS,
        salaryMin: 100_000,
        salaryMax: 150_000,
      }),
    ).toBe(true);

    expect(
      matchesApplicationFilters(base, {
        ...EMPTY_APPLICATION_FILTERS,
        appliedAfter: '2026-03-01',
        appliedBefore: '2026-03-31',
      }),
    ).toBe(true);

    expect(
      matchesApplicationFilters(
        buildApplication({ appliedAt: null }),
        {
          ...EMPTY_APPLICATION_FILTERS,
          appliedAfter: '2026-01-01',
        },
      ),
    ).toBe(false);
  });

  it('combines search query and structured filters', () => {
    const apps = [
      base,
      buildApplication({
        id: 'app-2',
        company: 'Beta LLC',
        techStack: ['React'],
        salary: 90_000,
        appliedAt: '2026-01-10T00:00:00.000Z',
      }),
    ];

    const result = filterApplications(apps, 'engineer', {
      ...EMPTY_APPLICATION_FILTERS,
      salaryMin: 100_000,
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.company).toBe('Acme Corp');
  });
});
