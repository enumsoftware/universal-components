import { Component } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** Every `variant` together, so they are compared rather than described. */
@Component({
  selector: 'uc-button-variants-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Primary Action" variant="primary" />
    <uc-button text="Secondary Action" variant="secondary" />
    <uc-button text="Text Action" variant="text" />
    <uc-button text="Delete" variant="error" />
    <uc-button text="Cookie settings" variant="link" />
  `,
})
export class VariantsExample {}
