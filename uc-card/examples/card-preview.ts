import { Component, input } from "@angular/core";

import { UcCard } from "../uc-card";

/**
 * `uc-card` is a pure content-projection surface, so a bare instance renders an
 * empty box. The showcase drives this preview instead, which supplies content -
 * the same shape a consuming app would write.
 */
@Component({
  selector: "uc-card-preview",
  imports: [UcCard],
  template: `<uc-card>{{ content() }}</uc-card>`,
})
export class CardPreview {
  readonly content = input<string>("Card content preview");
}
