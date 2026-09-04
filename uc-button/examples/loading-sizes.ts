import { Component } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** Every `size` mid-request - the spinner scales with the button it sits in. */
@Component({
  selector: 'uc-button-loading-sizes-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Edit" size="small" [loading]="true" />
    <uc-button text="Save invoice" size="medium" [loading]="true" />
    <uc-button text="Larger Action" size="big" [loading]="true" />
  `,
})
export class LoadingSizesExample {}
