import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  path: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly open = input(false);
  readonly navigate = output<void>();

  readonly navItems: NavItem[] = [
    {
      path: '/board',
      label: 'Board',
      description: 'Kanban view of your applications',
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      description: 'Overview and analytics',
    },
    {
      path: '/settings',
      label: 'Settings',
      description: 'Import, export, and preferences',
    },
  ];

  onNavClick(): void {
    this.navigate.emit();
  }
}
