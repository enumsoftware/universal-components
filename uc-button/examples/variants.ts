import { Component } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** Every `variant` together, so the three are compared rather than described. */
@Component({
  selector: 'uc-button-variants-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Primary Action" variant="primary" />
    <uc-button text="Secondary Action" variant="secondary" />
    <uc-button text="Delete" variant="error" />
  `,
})
export class VariantsExample {}
