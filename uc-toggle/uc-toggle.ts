import {
  Component,
  input,
  InputSignal,
  model,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormCheckboxControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

@Component({
  selector: 'uc-toggle',
  imports: [],
  templateUrl: './uc-toggle.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-toggle.css',
})
export class UcToggle implements FormCheckboxControl {
  readonly disabled = input<boolean>(false);

  valueChange = output<boolean>();
  checked = model<boolean>(false);
  errors?: InputSignal<readonly WithOptionalFieldTree<ValidationError>[]> | undefined;

  onToggle() {
    if (!this.disabled()) {
      this.checked.update((v) => !v);
      this.valueChange.emit(this.checked());
    }
  }
}
