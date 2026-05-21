import { isApplicationStatus } from './application-status';
import { Application } from './application.model';

const APPLICATION_FIELDS = [
  'id',
  'company',
  'role',
  'status',
  'order',
  'appliedAt',
  'salary',
  'techStack',
  'notes',
  'url',
  'createdAt',
  'updatedAt',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidApplication(value: unknown): value is Application {
  if (!isRecord(value)) {
    return false;
  }

  if (
    typeof value['id'] !== 'string' ||
    typeof value['company'] !== 'string' ||
    typeof value['role'] !== 'string' ||
    typeof value['order'] !== 'number' ||
    typeof value['notes'] !== 'string' ||
    typeof value['createdAt'] !== 'string' ||
    typeof value['updatedAt'] !== 'string' ||
    !isApplicationStatus(String(value['status']))
  ) {
    return false;
  }

  const appliedAt = value['appliedAt'];
  if (appliedAt !== null && typeof appliedAt !== 'string') {
    return false;
  }

  const salary = value['salary'];
  if (salary !== null && typeof salary !== 'number') {
    return false;
  }

  const url = value['url'];
  if (url !== null && typeof url !== 'string') {
    return false;
  }

  if (!Array.isArray(value['techStack'])) {
    return false;
  }

  return value['techStack'].every((item) => typeof item === 'string');
}

export type ApplicationImportResult =
  | { ok: true; data: Application[] }
  | { ok: false; error: string };

export function parseApplicationsImport(json: unknown): ApplicationImportResult {
  if (!Array.isArray(json)) {
    return { ok: false, error: 'Import file must contain a JSON array of applications.' };
  }

  if (json.length === 0) {
    return { ok: false, error: 'Import file cannot be empty.' };
  }

  for (let index = 0; index < json.length; index += 1) {
    if (!isValidApplication(json[index])) {
      return {
        ok: false,
        error: `Invalid application at index ${index}. Expected fields: ${APPLICATION_FIELDS.join(', ')}.`,
      };
    }
  }

  return { ok: true, data: json as Application[] };
}
