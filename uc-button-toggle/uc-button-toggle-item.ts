import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UC_BUTTON_TOGGLE } from './uc-button-toggle';

@Component({
  selector: 'uc-button-toggle-item',
  templateUrl: './uc-button-toggle-item.html',
  styleUrl: './uc-button-toggle-item.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcButtonToggleItem {
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  private readonly toggleGroup = inject(UC_BUTTON_TOGGLE, { optional: true, host: true });

  readonly selected = computed(() => this.toggleGroup?.selectedValue() === this.value());
  readonly isDisabled = computed(() => this.disabled() || (this.toggleGroup?.disabled() ?? false));

  onClick(event: MouseEvent): void {
    event.preventDefault();

    if (this.isDisabled()) {
      return;
    }

    this.toggleGroup?.selectValue(this.value());
  }
}
