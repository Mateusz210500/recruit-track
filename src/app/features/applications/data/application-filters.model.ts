export interface ApplicationFilters {
  company: string;
  techStack: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  appliedAfter: string | null;
  appliedBefore: string | null;
}

export const EMPTY_APPLICATION_FILTERS: ApplicationFilters = {
  company: '',
  techStack: [],
  salaryMin: null,
  salaryMax: null,
  appliedAfter: null,
  appliedBefore: null,
};

export function hasActiveFilters(filters: ApplicationFilters): boolean {
  return (
    filters.company.trim().length > 0 ||
    filters.techStack.length > 0 ||
    filters.salaryMin !== null ||
    filters.salaryMax !== null ||
    filters.appliedAfter !== null ||
    filters.appliedBefore !== null
  );
}
