import { Application } from '../src/app/features/applications/data/application.model';

export function buildApplication(
  overrides: Partial<Application> = {},
): Application {
  const now = new Date().toISOString();

  return {
    id: 'app-test-1',
    company: 'Test Corp',
    role: 'Engineer',
    status: 'applied',
    order: 0,
    appliedAt: null,
    salary: null,
    techStack: ['Angular'],
    notes: '',
    url: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
