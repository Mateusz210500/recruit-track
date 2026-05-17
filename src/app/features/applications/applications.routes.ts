import { Routes } from '@angular/router';

export const boardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/kanban/kanban.page').then((m) => m.KanbanPage),
  },
];

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
];
