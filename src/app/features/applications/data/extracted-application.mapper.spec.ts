import { describe, expect, it } from 'vitest';

import {
  mapExtractedToFormValues,
  normalizeJobUrl,
  parseSalaryFromText,
} from './extracted-application.mapper';

describe('extracted-application.mapper', () => {
  it('parses numeric salary from text', () => {
    expect(parseSalaryFromText('15 000 PLN net / month')).toBe(15000);
    expect(parseSalaryFromText(null)).toBeNull();
    expect(parseSalaryFromText('negotiable')).toBeNull();
  });

  it('normalizes URLs without protocol', () => {
    expect(normalizeJobUrl('justjoin.it/offers/example')).toBe(
      'https://justjoin.it/offers/example',
    );
  });

  it('maps extracted data to form values', () => {
    const result = mapExtractedToFormValues({
      company: ' Acme ',
      role: ' Engineer ',
      salary: '180000 USD',
      techStack: ['Angular', 'TypeScript'],
      notes: 'Great team',
      url: 'https://example.com/jobs/1',
    });

    expect(result).toEqual({
      company: 'Acme',
      role: 'Engineer',
      techStack: 'Angular, TypeScript',
      salary: 180000,
      url: 'https://example.com/jobs/1',
      notes: 'Great team',
    });
  });

  it('keeps unparsed salary in notes', () => {
    const result = mapExtractedToFormValues({
      company: 'Acme',
      role: 'Engineer',
      salary: 'competitive',
      techStack: [],
      notes: 'Remote',
      url: 'https://example.com/jobs/1',
    });

    expect(result.salary).toBeNull();
    expect(result.notes).toContain('Salary: competitive');
  });
});
