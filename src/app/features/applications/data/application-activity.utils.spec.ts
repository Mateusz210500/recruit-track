import { describe, expect, it } from 'vitest';

import { buildApplication } from '../../../../../testing/factories';
import { buildRecentActivity } from './application-activity.utils';

describe('buildRecentActivity', () => {
  it('returns created, applied, and updated events sorted newest first', () => {
    const items = buildRecentActivity([
      buildApplication({
        id: 'a',
        createdAt: '2026-05-01T10:00:00.000Z',
        updatedAt: '2026-05-03T10:00:00.000Z',
        appliedAt: '2026-05-02T10:00:00.000Z',
      }),
      buildApplication({
        id: 'b',
        createdAt: '2026-05-04T10:00:00.000Z',
        updatedAt: '2026-05-04T10:00:00.000Z',
        appliedAt: null,
      }),
    ]);

    expect(items.map((item) => item.id)).toEqual([
      'b-created',
      'a-updated',
      'a-applied',
      'a-created',
    ]);
  });

  it('limits the number of activity items', () => {
    const apps = Array.from({ length: 10 }, (_, index) =>
      buildApplication({
        id: `app-${index}`,
        createdAt: `2026-05-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
        updatedAt: `2026-05-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
      }),
    );

    expect(buildRecentActivity(apps, 3)).toHaveLength(3);
  });
});
