import { Component } from '@angular/core';

import { UcButton } from '../uc-button';

@Component({
  selector: 'uc-button-with-suffix-icon-example',
  imports: [UcButton],
  template: `
    <uc-button text="Next">
      <i ucButtonSuffix class="ph-bold ph-arrow-right"></i>
    </uc-button>
  `,
})
export class WithSuffixIconExample {}
