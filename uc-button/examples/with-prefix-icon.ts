import { Component } from "@angular/core";

import { UcButton } from "../uc-button";

@Component({
  selector: "uc-button-with-prefix-icon-example",
  imports: [UcButton],
  template: `
    <uc-button text="Save">
      <i ucButtonPrefix class="ph-bold ph-floppy-disk"></i>
    </uc-button>
  `,
})
export class WithPrefixIconExample {}
