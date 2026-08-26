import { Component, inject, input } from '@angular/core';

import type { ShowcaseLayout } from '../core';
import { ThemeStore } from './theme';

/**
 * The themed preview surface every component renders inside.
 *
 * Carries its own `data-theme`, which overrides the chrome's for this subtree
 * only - so the preview can be a different theme from the app around it.
 */
@Component({
  selector: 'wb-canvas',
  template: `
    <div
      class="wb-canvas"
      [attr.data-theme]="theme.canvas()"
      [class]="'wb-canvas-' + layout()"
      [style.max-width.px]="maxWidth()"
    >
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .wb-canvas {
      /*
       * Scoped rather than a global reset: the canvas must keep rendering
       * components exactly as a consuming app would, and a page-wide
       * border-box would silently change that. Without it the viewport preset
       * sizes the content box, so a 768px canvas measures 834px once padding
       * and border are added.
       */
      box-sizing: border-box;
      background-color: var(--background-color);
      color: var(--font-color);
      border: 1px solid var(--uc-content-hr-color);
      border-radius: var(--card-border-radius);
      overflow: auto;
    }

    .wb-canvas-centered {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 12rem;
      padding: 2rem;
    }

    .wb-canvas-padded {
      display: block;
      padding: 2rem;
    }

    .wb-canvas-fullscreen {
      display: block;
      padding: 0;
      min-height: 30rem;
    }
  `,
})
export class WbCanvas {
  readonly layout = input<ShowcaseLayout>('centered');
  /** Viewport preset width in px, or null for the full column. */
  readonly maxWidth = input<number | null>(null);
  protected readonly theme = inject(ThemeStore);
}
