import { ChangeDetectionStrategy, Component, InjectionToken, Signal, input, model } from '@angular/core';

export interface UcSegmentedToggleController {
  selectedValue: Signal<string>;
  disabled: Signal<boolean>;
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
  readonly ariaLabel = input<string | null>(null);
  readonly selectedValue: Signal<string> = this.value;

  selectValue(value: string): void {
    if (this.disabled() || this.value() === value) {
      return;
    }

    this.value.set(value);
  }
}
