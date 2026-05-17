import { describe, expect, it } from 'vitest';

import { buildApplication } from '../../../../../testing/factories';
import { applyMove } from './application-order';

describe('applyMove', () => {
  it('moves an application to another column at the target index', () => {
    const apps = [
      buildApplication({ id: 'a', status: 'applied', order: 0 }),
      buildApplication({ id: 'b', status: 'applied', order: 1 }),
      buildApplication({ id: 'c', status: 'interview', order: 0 }),
    ];

    const result = applyMove(apps, 'a', 'interview', 1);

    expect(result.find((app) => app.id === 'a')?.status).toBe('interview');
    expect(
      result
        .filter((app) => app.status === 'interview')
        .sort((left, right) => left.order - right.order)
        .map((app) => app.id),
    ).toEqual(['c', 'a']);
    expect(
      result
        .filter((app) => app.status === 'applied')
        .map((app) => app.id),
    ).toEqual(['b']);
  });

  it('reorders within the same column', () => {
    const apps = [
      buildApplication({ id: 'a', status: 'applied', order: 0 }),
      buildApplication({ id: 'b', status: 'applied', order: 1 }),
      buildApplication({ id: 'c', status: 'applied', order: 2 }),
    ];

    const result = applyMove(apps, 'a', 'applied', 2);

    expect(
      result
        .filter((app) => app.status === 'applied')
        .sort((left, right) => left.order - right.order)
        .map((app) => app.id),
    ).toEqual(['b', 'c', 'a']);
  });
});
