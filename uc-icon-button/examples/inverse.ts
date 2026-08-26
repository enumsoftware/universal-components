import { Component } from '@angular/core';

import { UcIconButton } from '../uc-icon-button';

/** `inverseColor` is for placing the button on a dark surface. */
@Component({
  selector: 'uc-icon-button-inverse-example',
  imports: [UcIconButton],
  styles: `
    :host {
      display: inline-block;
      padding: 1rem;
      background-color: var(--inverse-background-color);
    }
  `,
  template: `<uc-icon-button label="Edit item" phosphorIcon="pencil" [inverseColor]="true" />`,
})
export class IconButtonInverseExample {}
