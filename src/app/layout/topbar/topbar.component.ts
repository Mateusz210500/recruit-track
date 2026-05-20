import { Component, inject, input, output } from '@angular/core';

import { ApplicationService } from '../../features/applications/data/application.service';
import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-topbar',
  imports: [IconComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly applicationService = inject(ApplicationService);

  readonly menuExpanded = input(false);
  readonly menuToggle = output<void>();

  protected readonly searchInput = this.applicationService.searchInput;

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.applicationService.setSearchInput(value);
  }
}
