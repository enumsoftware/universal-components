import { Component } from "@angular/core";

import { UcCard } from "../uc-card";
import { CARD_EXAMPLE_FRAME_STYLES } from "./example-layout";

/**
 * `uc-w-fit` is `width: fit-content`. Since the card fills its container by
 * default, this is the class that opts back out - on its own, paired with
 * `uc-mx-auto` to centre, or on a single card inside a grid of stretched ones.
 */
@Component({
  selector: "uc-card-hug-content-example",
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
        <div class="label"><code>uc-w-fit</code> - shrinks to its content</div>
        <uc-card class="uc-w-fit">Sign in to continue</uc-card>
      </div>

      <div>
        <div class="label">
          <code>uc-w-fit uc-mx-auto</code> - hugs and centres in the container
        </div>
        <uc-card class="uc-w-fit uc-mx-auto"
          >Centred on its own content</uc-card
        >
      </div>

      <div>
        <div class="label">
          One card opting out of a grid track the others fill
        </div>
        <div class="uc-grid uc-grid-cols-2 uc-gap-4">
          <uc-card>Takes the track</uc-card>
          <uc-card class="uc-w-fit">Hugs</uc-card>
        </div>
      </div>
    </div>
  `,
})
export class HugContentExample {}
