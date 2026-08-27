import { Component, input } from '@angular/core';

import type { ShowcaseLayout } from '../core';

/** The preview surface every component renders inside. */
@Component({
  selector: 'wb-canvas',
  template: `
    <!--
      Focusable because it scrolls. A viewport preset or a wide demo overflows
      the canvas, and a scroll container a keyboard user cannot reach is a real
      failure - one the accessibility sweep catches on the workbench itself.
    -->
    <div
      class="wb-canvas"
      tabindex="0"
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

    .wb-canvas:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
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
}
