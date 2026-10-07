import { ChangeDetectionStrategy, Component, InjectionToken, Signal, inject, input, model } from '@angular/core';
import { UC_DEFAULTS } from '../uc-defaults/uc-defaults';

/** `pills` draws each item as a separate, fully rounded pill, like the `pills` variant of uc-tabs. */
export const SEGMENTED_TOGGLE_VARIANT_OPTIONS = ['default', 'pills'] as const;
export type UcSegmentedToggleVariant = (typeof SEGMENTED_TOGGLE_VARIANT_OPTIONS)[number];

export interface UcSegmentedToggleController {
  selectedValue: Signal<string>;
  disabled: Signal<boolean>;
  variant: Signal<UcSegmentedToggleVariant>;
  selectValue(value: string): void;
}

export const UC_SEGMENTED_TOGGLE = new InjectionToken<UcSegmentedToggleController>('UC_SEGMENTED_TOGGLE');

@Component({
  selector: 'uc-segmented-toggle',
  templateUrl: './uc-segmented-toggle.html',
  styleUrl: './uc-segmented-toggle.css',
  providers: [{ provide: UC_SEGMENTED_TOGGLE, useExisting: UcSegmentedToggle }],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcSegmentedToggle implements UcSegmentedToggleController {
  readonly value = model.required<string>();
  readonly disabled = input<boolean>(false);
  readonly variant = input<UcSegmentedToggleVariant>(inject(UC_DEFAULTS).segmentedToggle?.variant ?? 'default');
  readonly ariaLabel = input<string | null>(null);
  readonly selectedValue: Signal<string> = this.value;

  selectValue(value: string): void {
    if (this.disabled() || this.value() === value) {
      return;
    }

    this.value.set(value);
  }
}
