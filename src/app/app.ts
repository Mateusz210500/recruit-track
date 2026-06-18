import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AutoRefreshService } from './core/auto-refresh/auto-refresh.service';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    inject(ThemeService);
    inject(AutoRefreshService);
  }
}
