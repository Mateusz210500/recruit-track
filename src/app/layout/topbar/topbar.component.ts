import { Component, inject, input, output } from '@angular/core';

import { isActive, Router } from '@angular/router';
import { ApplicationService } from '../../features/applications/data/application.service';
import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-topbar',
  imports: [IconComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly applicationService = inject(ApplicationService);
  private readonly router = inject(Router);

  readonly menuExpanded = input(false);
  readonly menuToggle = output<void>();

  protected readonly searchInput = this.applicationService.searchInput;
  protected readonly showBoardSearch = isActive('/board', this.router, {
    paths: 'exact',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  });

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.applicationService.setSearchInput(value);
  }
}
