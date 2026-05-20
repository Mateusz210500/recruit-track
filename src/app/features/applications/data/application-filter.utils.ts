import { Application } from './application.model';
import {
  ApplicationFilters,
  hasActiveFilters,
} from './application-filters.model';

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

export function matchesApplicationFilters(
  application: Application,
  filters: ApplicationFilters,
): boolean {
  if (!hasActiveFilters(filters)) {
    return true;
  }

  const company = filters.company.trim().toLowerCase();
  if (company && !application.company.toLowerCase().includes(company)) {
    return false;
  }

  if (filters.techStack.length > 0) {
    const appTech = application.techStack.map((tech) => tech.toLowerCase());
    const matchesTech = filters.techStack.some((tech) =>
      appTech.includes(tech.toLowerCase()),
    );
    if (!matchesTech) {
      return false;
    }
  }

  if (filters.salaryMin !== null || filters.salaryMax !== null) {
    if (application.salary === null) {
      return false;
    }
    if (filters.salaryMin !== null && application.salary < filters.salaryMin) {
      return false;
    }
    if (filters.salaryMax !== null && application.salary > filters.salaryMax) {
      return false;
    }
  }

  if (filters.appliedAfter || filters.appliedBefore) {
    if (!application.appliedAt) {
      return false;
    }
    const appliedDate = application.appliedAt.slice(0, 10);
    if (filters.appliedAfter && appliedDate < filters.appliedAfter) {
      return false;
    }
    if (filters.appliedBefore && appliedDate > filters.appliedBefore) {
      return false;
    }
  }

  return true;
}

export function filterApplications(
  applications: Application[],
  searchQuery: string,
  filters: ApplicationFilters,
): Application[] {
  return applications.filter(
    (application) =>
      matchesSearchQuery(application, searchQuery) &&
      matchesApplicationFilters(application, filters),
  );
}
