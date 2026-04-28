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
  selector: 'uc-textarea',
  imports: [CommonModule, FormsModule],
  templateUrl: './uc-textarea.html',
  styleUrl: './uc-textarea.css',
})
export class UcTextarea implements FormValueControl<string | null> {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(5);
  readonly autocomplete = input<string>('off');

  value = model<string | null>(null);
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  touched = model<boolean>(false);
  showErrorState = computed(() => this.invalid() && this.touched());
}
