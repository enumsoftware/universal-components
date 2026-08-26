import { Component, signal } from '@angular/core';

import { UcIconButton } from '../uc-icon-button';

/** `pressed` is a model, so the caller owns the toggle state. */
@Component({
  selector: 'uc-icon-button-toggle-example',
  imports: [UcIconButton],
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  `,
  template: `
    <uc-icon-button label="Bold" phosphorIcon="text-b" variant="secondary" [(pressed)]="bold" />
    <span>pressed: {{ bold() }}</span>
  `,
})
export class IconButtonToggleExample {
  readonly bold = signal<boolean | null>(false);
}
