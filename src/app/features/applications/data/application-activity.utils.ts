import { ActivityItem } from './application-activity.model';
import { Application } from './application.model';

const DEFAULT_ACTIVITY_LIMIT = 15;

export function buildRecentActivity(
  applications: Application[],
  limit = DEFAULT_ACTIVITY_LIMIT,
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const application of applications) {
    items.push({
      id: `${application.id}-created`,
      applicationId: application.id,
      company: application.company,
      role: application.role,
      status: application.status,
      type: 'created',
      timestamp: application.createdAt,
    });

    if (application.appliedAt) {
      items.push({
        id: `${application.id}-applied`,
        applicationId: application.id,
        company: application.company,
        role: application.role,
        status: application.status,
        type: 'applied',
        timestamp: application.appliedAt,
      });
    }

    if (application.updatedAt !== application.createdAt) {
      items.push({
        id: `${application.id}-updated`,
        applicationId: application.id,
        company: application.company,
        role: application.role,
        status: application.status,
        type: 'updated',
        timestamp: application.updatedAt,
      });
    }
  }

  return items
    .sort(
      (left, right) =>
        new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
    )
    .slice(0, limit);
}
