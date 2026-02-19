import { Component, input, InputSignal, model, output } from '@angular/core';
import { FormCheckboxControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Component({
  selector: 'uc-toggle',
  imports: [],
  templateUrl: './uc-toggle.html',
  styleUrl: './uc-toggle.scss',
})
export class UcToggle implements FormCheckboxControl {
  readonly disabled = input<boolean>(false);
  
  valueChange = output<boolean>();
  checked = model<boolean>(false);
  errors?: InputSignal<readonly WithOptionalField<ValidationError>[]> | undefined;

  onToggle() {
    if (!this.disabled()) {
      this.checked.update((v) => !v);
      this.valueChange.emit(this.checked());
    }
  }
}
