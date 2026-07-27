import { ChangeDetectionStrategy, Component, InjectionToken, Signal, input, model } from '@angular/core';

export interface UcButtonToggleController {
  selectedValue: Signal<string>;
  disabled: Signal<boolean>;
  selectValue(value: string): void;
}

export const UC_BUTTON_TOGGLE = new InjectionToken<UcButtonToggleController>('UC_BUTTON_TOGGLE');

@Component({
  selector: 'uc-button-toggle',
  templateUrl: './uc-button-toggle.html',
  styleUrl: './uc-button-toggle.css',
  providers: [{ provide: UC_BUTTON_TOGGLE, useExisting: UcButtonToggle }],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcButtonToggle implements UcButtonToggleController {
  readonly value = model.required<string>();
  readonly disabled = input<boolean>(false);
  readonly selectedValue: Signal<string> = this.value;

  selectValue(value: string): void {
    if (this.disabled() || this.value() === value) {
      return;
    }

    this.value.set(value);
  }
}
