import { ApplicationStatus } from './application-status';

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  order: number;
  appliedAt: string | null;
  salary: number | null;
  techStack: string[];
  notes: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateApplicationDto = Pick<Application, 'company' | 'role'> &
  Partial<
    Pick<
      Application,
      'status' | 'appliedAt' | 'salary' | 'techStack' | 'notes' | 'url'
    >
  >;

export type UpdateApplicationDto = Partial<
  Pick<
    Application,
    | 'company'
    | 'role'
    | 'status'
    | 'appliedAt'
    | 'salary'
    | 'techStack'
    | 'notes'
    | 'url'
  >
>;

export interface MoveApplicationDto {
  status: ApplicationStatus;
  index: number;
}
