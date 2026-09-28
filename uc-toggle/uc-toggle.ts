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
  /** Id of the switch element, for a <label for> or aria-labelledby elsewhere. */
  readonly id = input<string | null>(null);
  /** The accessible name when no visible text names the switch. */
  readonly ariaLabel = input<string | null>(null);
  /** Id(s) of the visible text that names the switch, such as a settings row label. */
  readonly ariaLabelledby = input<string | null>(null);

  valueChange = output<boolean>();
  checked = model<boolean>(false);
  errors?: InputSignal<readonly WithOptionalFieldTree<ValidationError>[]> | undefined;

  /** Space and Enter toggle it, like a native switch; Space would otherwise scroll the page. */
  onKey(event: Event) {
    event.preventDefault();
    this.onToggle();
  }

  onToggle() {
    if (!this.disabled()) {
      this.checked.update((v) => !v);
      this.valueChange.emit(this.checked());
    }
  }
}
