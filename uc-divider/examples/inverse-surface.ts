import { Component } from '@angular/core';

import { UcDivider } from '../uc-divider';

/** The inverse variant only reads correctly against a dark surface. */
@Component({
  selector: 'uc-divider-inverse-surface-example',
  imports: [UcDivider],
  styles: `
    :host {
      display: block;
      padding: 1rem;
      background-color: var(--inverse-background-color);
    }
  `,
  template: `<uc-divider variant="inverse" text="or" />`,
})
export class InverseSurfaceExample {}
