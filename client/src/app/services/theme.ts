import { Injectable, signal } from '@angular/core';

/**
 * ThemeService — controls dark / light mode for the whole app.
 *
 * How it works (simple version):
 *  1. We keep one signal `isDark` (true = dark mode).
 *  2. We put a `data-theme="dark"` (or "light") attribute on the <html> tag.
 *  3. styles.css reads that attribute and swaps the colors. That's it —
 *     no component needs to know about individual colors.
 *  4. We save the choice in localStorage so a page refresh keeps it.
 *
 * Default = DARK (only light if the user picked light before).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  // If nothing was saved yet, default to dark.
  isDark = signal(localStorage.getItem('theme') !== 'light');

  constructor() {
    this.apply(); // set the correct theme the moment the app starts
  }

  toggle(): void {
    this.isDark.set(!this.isDark());
    this.apply();
  }

  // Puts the theme on the page and remembers it.
  private apply(): void {
    const theme = this.isDark() ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
