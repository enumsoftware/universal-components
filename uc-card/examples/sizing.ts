import { Component } from "@angular/core";

import { UcCard } from "../uc-card";
import { CARD_EXAMPLE_FRAME_STYLES } from "./example-layout";

/**
 * The card sets no width of its own, so it fills whatever it is placed in.
 * Anything narrower is a layout decision, and it comes from the utility layer
 * rather than an input - which is what lets it change at a breakpoint.
 */
@Component({
  selector: "uc-card-sizing-example",
  imports: [UcCard],
  styles: [
    CARD_EXAMPLE_FRAME_STYLES,
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <div class="frame uc-flex uc-flex-col uc-gap-4">
      <div>
        <div class="label">Default - spans the container</div>
        <uc-card>Fills its container</uc-card>
      </div>

      <div>
        <div class="label"><code>uc-w-half</code> - half the container</div>
        <uc-card class="uc-w-half">Half width</uc-card>
      </div>

      <div>
        <div class="label">
          <code>uc-md-w-fit</code> - spans below 768px, shrinks to the content
          above
        </div>
        <uc-card class="uc-md-w-fit">Responsive width</uc-card>
      </div>
    </div>
  `,
})
export class SizingExample {}
