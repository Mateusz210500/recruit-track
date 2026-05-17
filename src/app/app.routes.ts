import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'board', pathMatch: 'full' },
      {
        path: 'board',
        loadChildren: () =>
          import('./features/applications/applications.routes').then(
            (m) => m.boardRoutes,
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/applications/applications.routes').then(
            (m) => m.dashboardRoutes,
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (m) => m.settingsRoutes,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'board' },
];
