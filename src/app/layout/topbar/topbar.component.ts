import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  readonly menuExpanded = input(false);
  readonly menuToggle = output<void>();
}
