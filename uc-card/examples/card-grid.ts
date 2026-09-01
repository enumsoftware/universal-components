import { Component } from "@angular/core";

import { UcCard } from "../uc-card";
import { CARD_EXAMPLE_FRAME_STYLES } from "./example-layout";

/**
 * The case the removed `fit` input existed for, now with nothing to declare:
 * the card takes the width of its grid track and stretches to the row height on
 * its own, so the third card being taller squares the other two up. Only the
 * content spacing needs a class.
 */
@Component({
  selector: "uc-card-grid-example",
  imports: [UcCard],
  styles: [CARD_EXAMPLE_FRAME_STYLES],
  template: `
    <div class="frame uc-grid-auto-fit uc-gap-4" style="--uc-grid-min: 14rem">
      <uc-card class="uc-gap-1">
        <strong>Revenue</strong>
        <span>€ 12,480</span>
      </uc-card>
      <uc-card class="uc-gap-1">
        <strong>Orders</strong>
        <span>318</span>
      </uc-card>
      <uc-card class="uc-gap-1">
        <strong>Refunds</strong>
        <span>7</span>
        <span>Two still awaiting a decision from the payment provider.</span>
      </uc-card>
    </div>
  `,
})
export class CardGridExample {}
