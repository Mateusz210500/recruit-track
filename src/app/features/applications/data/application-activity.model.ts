import { ApplicationStatus } from './application-status';

export type ActivityType = 'created' | 'applied' | 'updated';

export interface ActivityItem {
  id: string;
  applicationId: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  type: ActivityType;
  timestamp: string;
}
