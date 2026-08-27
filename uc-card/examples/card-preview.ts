import { Component, input } from '@angular/core';

import { UcCard, type CardFit } from '../uc-card';

/**
 * `uc-card` is a pure content-projection surface, so a bare instance renders an
 * empty box. The showcase drives this preview instead, which forwards the knob
 * and supplies content - the same shape a consuming app would write.
 */
@Component({
  selector: 'uc-card-preview',
  imports: [UcCard],
  template: `<uc-card [fit]="fit()">{{ content() }}</uc-card>`,
})
export class CardPreview {
  readonly fit = input<CardFit>('fit');
  readonly content = input<string>('Card content preview');
}
