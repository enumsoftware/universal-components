import { Component } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** Prefix, suffix and both, together - the three projection slots in one place. */
@Component({
  selector: 'uc-button-with-icons-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Save">
      <i ucButtonPrefix class="ph-bold ph-floppy-disk"></i>
    </uc-button>
    <uc-button text="Next">
      <i ucButtonSuffix class="ph-bold ph-arrow-right"></i>
    </uc-button>
    <uc-button text="Send Message">
      <i ucButtonPrefix class="ph-bold ph-chat-circle"></i>
      <i ucButtonSuffix class="ph-bold ph-paper-plane-tilt"></i>
    </uc-button>
  `,
})
export class WithIconsExample {}
