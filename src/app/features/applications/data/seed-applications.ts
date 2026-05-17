import { createId } from '../../../core/utils/id';
import { Application } from './application.model';
import { ApplicationStatus } from './application-status';

function buildSeed(
  company: string,
  role: string,
  status: ApplicationStatus,
  order: number,
  extras: Partial<Application> = {},
): Application {
  const now = new Date().toISOString();
  return {
    id: createId(),
    company,
    role,
    status,
    order,
    appliedAt: null,
    salary: null,
    techStack: [],
    notes: '',
    url: null,
    createdAt: now,
    updatedAt: now,
    ...extras,
  };
}

export function seedApplications(): Application[] {
  return [
    buildSeed('Vercel', 'Senior Frontend Engineer', 'wishlist', 0, {
      techStack: ['Next.js', 'React', 'TypeScript'],
      salary: 180000,
    }),
    buildSeed('Stripe', 'Software Engineer', 'applied', 0, {
      techStack: ['Angular', 'TypeScript', 'RxJS'],
      appliedAt: '2026-05-01',
      salary: 165000,
    }),
    buildSeed('Linear', 'Frontend Engineer', 'interview', 0, {
      techStack: ['React', 'GraphQL'],
      appliedAt: '2026-04-15',
    }),
    buildSeed('Figma', 'Product Engineer', 'offer', 0, {
      techStack: ['TypeScript', 'WebGL'],
      appliedAt: '2026-03-20',
      salary: 190000,
    }),
    buildSeed('Acme Corp', 'Junior Developer', 'rejected', 0, {
      appliedAt: '2026-02-10',
    }),
  ];
}
