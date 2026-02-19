import { Component, input, InputSignal, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormCheckboxControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Component({
  selector: 'uc-checkbox',
  imports: [CommonModule, FormsModule],
  templateUrl: './uc-checkbox.html',
  styleUrl: './uc-checkbox.scss',
})
export class UcCheckbox implements FormCheckboxControl {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);

  checked = model<boolean>(false);
  errors?: InputSignal<readonly WithOptionalField<ValidationError>[]> | undefined;

  toggleCheckbox(): void {
    if (!this.disabled()) {
      this.checked.update((val) => !val);
    }
  }
}
