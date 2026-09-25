import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UcPhosphorIcon, type PhosphorIconWeight } from '../uc-phosphor-icon/uc-phosphor-icon';
import { UC_SEGMENTED_TOGGLE } from './uc-segmented-toggle';

@Component({
  selector: 'uc-segmented-toggle-item',
  imports: [UcPhosphorIcon],
  templateUrl: './uc-segmented-toggle-item.html',
  styleUrl: './uc-segmented-toggle-item.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcSegmentedToggleItem {
  readonly value = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  /** Phosphor icon name, without the `ph-` prefix, shown before the projected text. */
  readonly icon = input<string | null>(null);
  readonly iconWeight = input<PhosphorIconWeight>('bold');

  private readonly toggleGroup = inject(UC_SEGMENTED_TOGGLE, { optional: true, host: true });

  readonly selected = computed(() => this.toggleGroup?.selectedValue() === this.value());
  readonly pills = computed(() => this.toggleGroup?.variant() === 'pills');
  readonly isDisabled = computed(() => this.disabled() || (this.toggleGroup?.disabled() ?? false));

  onClick(event: MouseEvent): void {
    event.preventDefault();

    if (this.isDisabled()) {
      return;
    }

    this.toggleGroup?.selectValue(this.value());
  }
}
