import { describe, expect, it } from 'vitest';

import { buildApplication } from '../../../../../testing/factories';
import {
  filterApplicationsBySearch,
  matchesSearchQuery,
} from './application-search.utils';

describe('application search utils', () => {
  const base = buildApplication({
    company: 'Acme Corp',
    role: 'Frontend Engineer',
    techStack: ['Angular', 'TypeScript'],
  });

  it('matches search query across company, role, notes, and tech stack', () => {
    expect(matchesSearchQuery(base, 'acme')).toBe(true);
    expect(matchesSearchQuery(base, 'angular')).toBe(true);
    expect(matchesSearchQuery(base, 'designer')).toBe(false);
    expect(matchesSearchQuery(base, '')).toBe(true);
  });

  it('filters a list by search query', () => {
    const apps = [
      base,
      buildApplication({ id: 'app-2', company: 'Beta LLC', role: 'Designer' }),
    ];

    expect(filterApplicationsBySearch(apps, 'engineer')).toHaveLength(1);
    expect(filterApplicationsBySearch(apps, '')).toHaveLength(2);
  });
});
