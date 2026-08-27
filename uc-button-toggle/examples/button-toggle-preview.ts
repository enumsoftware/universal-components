import { Component, effect, input, signal } from '@angular/core';

import { UcButtonToggleItem } from '../uc-button-toggle-item';
import { UcButtonToggle } from '../uc-button-toggle';

/** `value` is a model, so the group reports selection back to the caller. */
@Component({
  selector: 'uc-button-toggle-preview',
  imports: [UcButtonToggle, UcButtonToggleItem],
  styles: `
    p {
      margin-top: 1rem;
      color: var(--paragraph-text-color);
    }
  `,
  template: `
    <uc-button-toggle [(value)]="selected" [disabled]="disabled()">
      <uc-button-toggle-item value="all">All</uc-button-toggle-item>
      <uc-button-toggle-item value="products">Products</uc-button-toggle-item>
      <uc-button-toggle-item value="saved" [disabled]="true" ariaLabel="Saved items">
        <i class="ph-bold ph-bookmark-simple"></i>
      </uc-button-toggle-item>
      <uc-button-toggle-item value="filters" ariaLabel="Filters">
        <i class="ph-bold ph-faders-horizontal"></i>
      </uc-button-toggle-item>
    </uc-button-toggle>
    <p>Selected value: {{ selected() }}</p>
  `,
})
export class ButtonTogglePreview {
  readonly value = input<string>('all');
  readonly disabled = input<boolean>(false);

  protected readonly selected = signal('all');

  constructor() {
    effect(() => this.selected.set(this.value()));
  }
}
