import { Component } from "@angular/core";

import { UcCard } from "../uc-card";
import { CARD_EXAMPLE_FRAME_STYLES } from "./example-layout";

/**
 * A flex row is the one place the card does not fill on its own - a flex item
 * is sized from its content unless something says otherwise. `uc-flex-1` gives
 * equal shares and `uc-grow` lets one card take the slack.
 */
@Component({
  selector: "uc-card-in-flex-row-example",
  imports: [UcCard],
  styles: [CARD_EXAMPLE_FRAME_STYLES],
  template: `
    <div class="frame uc-flex uc-flex-col uc-md-flex-row uc-gap-4">
      <uc-card class="uc-flex-1">Equal share</uc-card>
      <uc-card class="uc-flex-1">Equal share</uc-card>
      <uc-card class="uc-grow">Takes the remaining space</uc-card>
    </div>
  `,
})
export class CardInFlexRowExample {}
