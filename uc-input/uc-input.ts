import { Component, input, signal, model, computed, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';

@Component({
  selector: 'uc-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './uc-input.html',
  styleUrl: './uc-input.css',
})
export class UcInput implements FormValueControl<string | number | null> {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'datetime-local'>(
    'text'
  );
  readonly autocomplete = input<string>('off');

  value = model<string | number | null>(null);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  touched = model<boolean>(false);
  showErrorState = computed(() => this.invalid() && this.touched());
}
