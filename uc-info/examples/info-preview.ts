import { Component, input } from '@angular/core';

import { UcInfo, type InfoVariant } from '../uc-info';

/**
 * `uc-info` projects both a `[title]` slot and its body, so the showcase drives
 * this preview rather than a bare instance.
 */
@Component({
  selector: 'uc-info-preview',
  imports: [UcInfo],
  template: `
    <uc-info [variant]="variant()">
      <span title>{{ heading() }}</span>
      {{ body() }}
    </uc-info>
  `,
})
export class InfoPreview {
  readonly variant = input<InfoVariant>('info');
  readonly heading = input<string>('Information title');
  readonly body = input<string>('This is an informational message to the user.');
}
