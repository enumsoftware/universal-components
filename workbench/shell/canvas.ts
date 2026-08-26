import { Component, inject, input } from "@angular/core";

import type { ShowcaseLayout } from "../core";
import { ThemeStore } from "./theme";

/**
 * The themed preview surface every component renders inside.
 *
 * Carries its own `data-theme`, which overrides the chrome's for this subtree
 * only - so the preview can be a different theme from the app around it.
 */
@Component({
  selector: "wb-canvas",
  template: `
    <div class="wb-canvas" [attr.data-theme]="theme.canvas()" [class]="'wb-canvas-' + layout()">
      <ng-content />
    </div>
  `,
  styles: `
    .wb-canvas {
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
  readonly layout = input<ShowcaseLayout>("centered");
  protected readonly theme = inject(ThemeStore);
}
