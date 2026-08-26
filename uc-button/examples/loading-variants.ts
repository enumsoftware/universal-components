import { Component } from "@angular/core";

import { UcButton } from "../uc-button";

@Component({
  selector: "uc-button-loading-variants-example",
  imports: [UcButton],
  styles: `
    :host {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  `,
  template: `
    <uc-button text="Primary" variant="primary" [loading]="true" />
    <uc-button text="Secondary" variant="secondary" [loading]="true" />
    <uc-button text="Delete" variant="error" [loading]="true" />
  `,
})
export class LoadingVariantsExample {}
