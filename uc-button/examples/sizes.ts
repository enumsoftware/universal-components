import { Component } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** Every `size` together - the padding and type scale only read as a scale side by side. */
@Component({
  selector: 'uc-button-sizes-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Compact" size="small" />
    <uc-button text="Click Me" size="medium" />
    <uc-button text="Larger Action" size="big" />
  `,
})
export class SizesExample {}
