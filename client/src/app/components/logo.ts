import { Component } from '@angular/core';

/**
 * Logo — the app name "CareerAI" with a small sparkle icon.
 * Kept as its own component so the SAME logo shows on every screen
 * and we only edit it in one place.
 */
@Component({
  selector: 'app-logo',
  template: `
    <span class="logo">
      <!-- A simple "sparkle" icon = the AI vibe. It's just an SVG shape. -->
      <span class="icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M12 2l1.9 5.3L19 9.2l-5.1 1.9L12 16l-1.9-4.9L5 9.2l5.1-1.9L12 2z" />
          <path d="M19 14l.9 2.4L22 17.5l-2.1.9L19 21l-.9-2.6L16 17.5l2.1-1.1L19 14z" />
        </svg>
      </span>
      <span class="name">Career<b>AI</b></span>
    </span>
  `,
  styles: [
    `
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--text);
      }
      .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: var(--primary);
        color: #fff;
      }
      .name b {
        color: var(--primary);
      }
    `,
  ],
})
export class Logo {}
