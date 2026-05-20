import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { IconComponent, IconName } from '../../shared/icons';

export interface NavTooltipState {
  path: string;
  text?: string;
  top: number;
  left: number;
}

export interface NavItem {
  path: string;
  label: string;
  description?: string;
  icon: Extract<IconName, 'board' | 'dashboard' | 'settings'>;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly open = input(false);
  readonly collapsed = input(false);
  readonly navigate = output<void>();
  readonly collapseToggle = output<void>();

  readonly navTooltip = signal<NavTooltipState | null>(null);

  readonly navItems: NavItem[] = [
    {
      path: '/board',
      label: 'Board',
      icon: 'board',
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      description: 'Overview and analytics',
      icon: 'dashboard',
    },
    {
      path: '/settings',
      label: 'Settings',
      description: 'Import, export, and preferences',
      icon: 'settings',
    },
  ];

  onNavClick(): void {
    this.navigate.emit();
  }

  showNavTooltip(event: Event, item: NavItem): void {
    const el = event.currentTarget;
    if (!(el instanceof HTMLElement)) {
      return;
    }

    const rect = el.getBoundingClientRect();
    this.navTooltip.set({
      path: item.path,
      text: item.description,
      top: rect.top + rect.height / 2,
      left: rect.right + 8,
    });
  }

  hideNavTooltip(): void {
    this.navTooltip.set(null);
  }

  onCollapseToggle(): void {
    this.collapseToggle.emit();
  }
}
