import { ExtractedApplication } from './extracted-application.model';

export function parseSalaryFromText(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const digits = value.replace(/[^\d]/g, '');
  if (!digits) {
    return null;
  }

  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

export function mapExtractedToFormValues(data: ExtractedApplication): {
  company: string;
  role: string;
  techStack: string;
  salary: number | null;
  url: string;
  notes: string;
} {
  const salary = parseSalaryFromText(data.salary);
  let notes = data.notes.trim();

  if (data.salary && salary === null) {
    const salaryNote = `Salary: ${data.salary}`;
    notes = notes ? `${notes}\n\n${salaryNote}` : salaryNote;
  }

  return {
    company: data.company.trim(),
    role: data.role.trim(),
    techStack: data.techStack.join(', '),
    salary,
    url: data.url,
    notes,
  };
}

export function normalizeJobUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
