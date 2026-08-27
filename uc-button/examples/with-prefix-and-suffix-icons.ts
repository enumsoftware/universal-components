import { Component } from '@angular/core';

import { UcButton } from '../uc-button';

@Component({
  selector: 'uc-button-with-prefix-and-suffix-icons-example',
  imports: [UcButton],
  template: `
    <uc-button text="Send Message">
      <i ucButtonPrefix class="ph-bold ph-chat-circle"></i>
      <i ucButtonSuffix class="ph-bold ph-paper-plane-tilt"></i>
    </uc-button>
  `,
})
export class WithPrefixAndSuffixIconsExample {}
