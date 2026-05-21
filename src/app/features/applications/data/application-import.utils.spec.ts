import { describe, expect, it } from 'vitest';

import { buildApplication } from '../../../../../testing/factories';
import { parseApplicationsImport } from './application-import.utils';

describe('parseApplicationsImport', () => {
  it('accepts a valid applications array', () => {
    const apps = [buildApplication()];
    const result = parseApplicationsImport(apps);

    expect(result).toEqual({ ok: true, data: apps });
  });

  it('rejects non-array payloads', () => {
    const result = parseApplicationsImport({ items: [] });

    expect(result).toEqual({
      ok: false,
      error: 'Import file must contain a JSON array of applications.',
    });
  });

  it('rejects invalid application records', () => {
    const result = parseApplicationsImport([{ company: 'Only name' }]);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Invalid application at index 0');
    }
  });
});
