import { ApplicationStatus } from './application-status';
import { Application } from './application.model';

export function applyMove(
  apps: Application[],
  id: string,
  newStatus: ApplicationStatus,
  newIndex: number,
): Application[] {
  const cloned = apps.map((app) => ({ ...app }));
  const moving = cloned.find((app) => app.id === id);
  if (!moving) {
    return apps;
  }

  const oldStatus = moving.status;
  moving.status = newStatus;

  const reindexColumn = (status: ApplicationStatus, orderedIds: string[]) => {
    orderedIds.forEach((appId, index) => {
      const app = cloned.find((item) => item.id === appId);
      if (app) {
        app.order = index;
      }
    });

    cloned
      .filter((app) => app.status === status && !orderedIds.includes(app.id))
      .sort((a, b) => a.order - b.order)
      .forEach((app, index) => {
        app.order = orderedIds.length + index;
      });
  };

  if (oldStatus !== newStatus) {
    const oldColumnIds = cloned
      .filter((app) => app.status === oldStatus)
      .sort((a, b) => a.order - b.order)
      .map((app) => app.id);
    reindexColumn(oldStatus, oldColumnIds);
  }

  const targetIds = cloned
    .filter((app) => app.status === newStatus && app.id !== id)
    .sort((a, b) => a.order - b.order)
    .map((app) => app.id);

  targetIds.splice(newIndex, 0, id);
  reindexColumn(newStatus, targetIds);

  return cloned;
}
