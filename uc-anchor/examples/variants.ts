import { Component } from '@angular/core';

import { UcAnchor } from '../uc-anchor';
import { ANCHOR_EXAMPLE_ROW_STYLES } from './example-layout';

/** Both `variant`s together, so they are compared rather than described. */
@Component({
  selector: 'uc-anchor-variants-example',
  imports: [UcAnchor],
  styles: ANCHOR_EXAMPLE_ROW_STYLES,
  template: `
    <a ucAnchor href="#" variant="primary">Primary Action</a>
    <a ucAnchor href="#" variant="error">Delete Account</a>
  `,
})
export class VariantsExample {}
