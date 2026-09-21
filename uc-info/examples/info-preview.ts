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
    <uc-info [variant]="variant()" [showIcon]="showIcon()">
      @if (customIcon()) {
        <i icon class="ph ph-star"></i>
      }
      <span title>{{ heading() }}</span>
      {{ body() }}
    </uc-info>
  `,
})
export class InfoPreview {
  readonly variant = input<InfoVariant>('info');
  readonly showIcon = input<boolean>(true);
  readonly customIcon = input<boolean>(false);
  readonly heading = input<string>('Information title');
  readonly body = input<string>('This is an informational message to the user.');
}
