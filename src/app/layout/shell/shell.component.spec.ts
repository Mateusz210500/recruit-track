import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';

import { routes } from '../../app.routes';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('renders primary navigation links', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll(
      'nav[aria-label="Primary"] a',
    ) as NodeListOf<HTMLAnchorElement>;

    expect(links.length).toBe(3);
    expect([...links].map((link) => link.textContent?.trim())).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Board'),
        expect.stringContaining('Dashboard'),
        expect.stringContaining('Settings'),
      ]),
    );
  });

  it('renders a router outlet for feature pages', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });

  it('exposes a skip link to main content', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    const skipLink = fixture.nativeElement.querySelector(
      'a[href="#main-content"]',
    ) as HTMLAnchorElement | null;

    expect(skipLink?.textContent?.trim()).toBe('Skip to main content');
  });

  it('toggles the mobile navigation menu', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector(
      '#app-sidebar',
    ) as HTMLElement;
    const toggle = fixture.nativeElement.querySelector(
      'button[aria-controls="app-sidebar"]',
    ) as HTMLButtonElement;

    expect(sidebar.classList.contains('translate-x-0')).toBe(false);

    toggle.click();
    fixture.detectChanges();
    expect(sidebar.classList.contains('translate-x-0')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    fixture.detectChanges();
    expect(sidebar.classList.contains('translate-x-0')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('redirects to the board placeholder by default', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');

    expect(router.url).toBe('/board');
  });
});
