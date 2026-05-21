import { Application } from './application.model';

export function matchesSearchQuery(
  application: Application,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  const haystack = [
    application.company,
    application.role,
    application.notes,
    ...application.techStack,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

export function filterApplicationsBySearch(
  applications: Application[],
  query: string,
): Application[] {
  return applications.filter((application) =>
    matchesSearchQuery(application, query),
  );
}
