import { Component } from '@angular/core';

import { UcAnchor } from '../uc-anchor';
import { ANCHOR_EXAMPLE_ROW_STYLES } from './example-layout';

/**
 * A disabled anchor loses its `href` rather than just dimming, so there is nothing left to
 * navigate to by click, middle click or keyboard - open devtools and compare the two elements.
 */
@Component({
  selector: 'uc-anchor-disabled-example',
  imports: [UcAnchor],
  styles: ANCHOR_EXAMPLE_ROW_STYLES,
  template: `
    <a ucAnchor href="/billing" variant="primary">Enabled</a>
    <a ucAnchor href="/billing" variant="primary" disabled>Disabled</a>
    <a ucAnchor href="/billing" variant="error" disabled>Disabled Error</a>
  `,
})
export class DisabledExample {}
