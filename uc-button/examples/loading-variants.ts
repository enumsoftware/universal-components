import { Component } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** Every `variant` mid-request - the spinner takes its color from the label. */
@Component({
  selector: 'uc-button-loading-variants-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Primary" variant="primary" [loading]="true" />
    <uc-button text="Secondary" variant="secondary" [loading]="true" />
    <uc-button text="Delete" variant="error" [loading]="true" />
  `,
})
export class LoadingVariantsExample {}
