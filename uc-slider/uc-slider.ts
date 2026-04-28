import {
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';

@Component({
  selector: 'uc-slider',
  imports: [FormsModule],
  templateUrl: './uc-slider.html',
  styleUrl: './uc-slider.css',
  host: {
    class: 'uc-slider-host',
  },
})
export class UcSlider implements FormValueControl<number> {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly invalid = input<boolean>(false);

  // Slider-specific inputs (part of FormValueControl interface)
  readonly min = input<number | undefined>(0);
  readonly max = input<number | undefined>(100);
  readonly step = input<number | undefined>(1);
  readonly showValue = input<boolean>(true);

  value = model<number>(0);
  touched = model<boolean>(false);

  readonly showErrorState = computed(() => this.invalid() && this.touched());

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
    this.touched.set(true);
  }
}
