import { Component, input } from '@angular/core';

import { IconName } from './icon-name';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly iconClass = input('', { alias: 'class' });
  readonly strokeWidth = input('2');
}
