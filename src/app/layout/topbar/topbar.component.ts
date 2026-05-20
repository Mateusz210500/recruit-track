import { Component, input, output } from '@angular/core';

import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-topbar',
  imports: [IconComponent],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  readonly menuExpanded = input(false);
  readonly menuToggle = output<void>();
}
