import { Component } from '@angular/core';

import { UcDivider } from '../uc-divider';

/** A vertical divider takes its length from the container, so it needs a height. */
@Component({
  selector: 'uc-divider-vertical-example',
  imports: [UcDivider],
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 60px;
    }
  `,
  template: `<uc-divider [vertical]="true" />`,
})
export class VerticalExample {}
