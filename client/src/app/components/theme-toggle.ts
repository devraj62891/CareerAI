import { Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme';

/**
 * ThemeToggle — a button that switches dark <-> light mode.
 * Shows a moon in dark mode and a sun in light mode.
 * All the real logic lives in ThemeService; this is just the button.
 */
@Component({
  selector: 'app-theme-toggle',
  template: `
    <button class="toggle" (click)="theme.toggle()" [title]="theme.isDark() ? 'Switch to light' : 'Switch to dark'">
      {{ theme.isDark() ? '🌙' : '☀️' }}
    </button>
  `,
  styles: [
    `
      .toggle {
        width: 38px;
        height: 38px;
        border-radius: 9px;
        border: 1px solid var(--border);
        background: var(--surface-2);
        cursor: pointer;
        font-size: 1.05rem;
        line-height: 1;
      }
      .toggle:hover {
        border-color: var(--primary);
      }
    `,
  ],
})
export class ThemeToggle {
  // `protected`/public so the template can read theme.isDark()
  theme = inject(ThemeService);
}
