import { Component } from "@angular/core";

import { UcButton } from "../uc-button";

@Component({
  selector: "uc-button-table-action-primary-example",
  imports: [UcButton],
  template: `
    <uc-button text="Edit" variant="primary" size="small">
      <i ucButtonPrefix class="ph-bold ph-pencil"></i>
    </uc-button>
  `,
})
export class TableActionPrimaryExample {}

@Component({
  selector: "uc-button-table-action-secondary-example",
  imports: [UcButton],
  template: `
    <uc-button text="View" variant="secondary" size="small">
      <i ucButtonPrefix class="ph-bold ph-eye"></i>
    </uc-button>
  `,
})
export class TableActionSecondaryExample {}
