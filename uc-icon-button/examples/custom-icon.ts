import { Component } from '@angular/core';

import { UcFlag } from '../../uc-flag/uc-flag';
import { UcIconButton } from '../uc-icon-button';

/** Leave `phosphorIcon` unset and project any icon instead: another icon font, an SVG or a flag. */
@Component({
  selector: 'uc-icon-button-custom-icon-example',
  imports: [UcFlag, UcIconButton],
  styles: `
    :host {
      display: flex;
      gap: 1rem;
    }
  `,
  template: `
    <uc-icon-button label="Language: Croatian" variant="secondary">
      <uc-flag countryCode="hr" size="1.25rem" [circular]="true" />
    </uc-icon-button>
    <uc-icon-button label="Refresh" variant="icon">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </uc-icon-button>
  `,
})
export class IconButtonCustomIconExample {}
