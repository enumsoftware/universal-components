import { Component, input } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcTooltip, type UcTooltipPosition } from '../uc-tooltip';

@Component({
  selector: 'uc-tooltip-preview',
  imports: [UcButton, UcTooltip],
  styles: `
    :host {
      display: flex;
      justify-content: center;
      padding: 5rem 0;
    }
  `,
  template: `
    <uc-button
      text="Hover over me"
      [ucTooltip]="message()"
      [ucTooltipPosition]="position()"
      [ucTooltipMargin]="margin()"
    />
  `,
})
export class TooltipPreview {
  readonly message = input<string>('This is a helpful tooltip');
  readonly position = input<UcTooltipPosition | undefined>(undefined);
  readonly margin = input<string | undefined>(undefined);
}

const POSITIONS: UcTooltipPosition[] = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'right',
];

/** Every anchor position at once; the tooltip flips when it would leave the viewport. */
@Component({
  selector: 'uc-tooltip-positions-example',
  imports: [UcButton, UcTooltip],
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
      padding: 6rem 1rem;
    }
  `,
  template: `
    @for (position of positions; track position) {
      <uc-button [text]="position" [ucTooltip]="message()" [ucTooltipPosition]="position" />
    }
  `,
})
export class TooltipPositionsExample {
  readonly message = input<string>('This is a helpful tooltip');
  protected readonly positions = POSITIONS;
}
