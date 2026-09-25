import { Component, effect, input, signal } from '@angular/core';

import { UcSegmentedToggleItem } from '../uc-segmented-toggle-item';
import { UcSegmentedToggle, type UcSegmentedToggleVariant } from '../uc-segmented-toggle';

/** `value` is a model, so the group reports selection back to the caller. */
@Component({
  selector: 'uc-segmented-toggle-preview',
  imports: [UcSegmentedToggle, UcSegmentedToggleItem],
  styles: `
    p {
      margin-top: 1rem;
      color: var(--uc-paragraph-text-color);
    }
  `,
  template: `
    <uc-segmented-toggle [(value)]="selected" [disabled]="disabled()" [variant]="variant()">
      <uc-segmented-toggle-item value="all">All</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="products" icon="package">Products</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="saved" [disabled]="true" ariaLabel="Saved items">
        <i class="ph-bold ph-bookmark-simple"></i>
      </uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="filters" ariaLabel="Filters">
        <i class="ph-bold ph-faders-horizontal"></i>
      </uc-segmented-toggle-item>
    </uc-segmented-toggle>
    <p>Selected value: {{ selected() }}</p>
  `,
})
export class SegmentedTogglePreview {
  readonly value = input<string>('all');
  readonly disabled = input<boolean>(false);
  readonly variant = input<UcSegmentedToggleVariant>('default');

  protected readonly selected = signal('all');

  constructor() {
    effect(() => this.selected.set(this.value()));
  }
}
