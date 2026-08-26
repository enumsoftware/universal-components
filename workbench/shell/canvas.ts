import { Component, inject, input } from "@angular/core";

import type { ShowcaseLayout } from "../core";
import { ThemeStore } from "./theme";

/** The themed preview surface every component renders inside. */
@Component({
  selector: "wb-canvas",
  template: `
    <div class="wb-canvas" [attr.data-theme]="theme.theme()" [class]="'wb-canvas-' + layout()">
      <ng-content />
    </div>
  `,
  styles: `
    .wb-canvas {
      background-color: var(--background-color);
      color: var(--font-color);
      border: 1px solid var(--wb-border);
      border-radius: 0.75rem;
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
