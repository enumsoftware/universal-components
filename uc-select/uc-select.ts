import { Component, input, model, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

/**
 * Option interface for select dropdown
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'uc-select',

  imports: [CommonModule, FormsModule, OverlayModule],
  templateUrl: './uc-select.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-select.css',
})
export class UcSelect<T = string> implements FormValueControl<T | null> {
  // Input properties
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly placeholder = input<string>('Select an option');
  readonly options = input<SelectOption<T>[]>([]);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);

  // Model properties
  value = model<T | null>(null);
  touched = model<boolean>(false);
  invalid = model<boolean>(false);

  // Internal state
  isOpen = signal<boolean>(false);

  // Computed properties
  showErrorState = computed(() => this.invalid() && this.touched());

  selectedOption = computed(() => {
    const currentValue = this.value();
    return this.options().find((opt) => opt.value === currentValue);
  });

  selectedLabel = computed(() => {
    return this.selectedOption()?.label || this.placeholder();
  });

  /**
   * Toggle the dropdown open/close state
   */
  toggleDropdown(): void {
    if (!this.disabled()) {
      this.isOpen.update((state) => !state);
    }
  }

  /**
   * Open the dropdown
   */
  openDropdown(): void {
    this.onBlur();
    if (!this.disabled()) {
      this.isOpen.set(true);
    }
  }

  /**
   * Close the dropdown
   */
  closeDropdown(): void {
    this.isOpen.set(false);
  }

  /**
   * Select an option by value
   */
  selectOption(option: SelectOption<T>): void {
    if (!option.disabled) {
      this.value.set(option.value);
      this.touched.set(true);
      this.closeDropdown();
    }
  }

  /**
   * Handle blur event
   */
  onBlur(): void {
    this.touched.set(true);
    // Delay closing to allow click events on options to complete
    setTimeout(() => {
      this.closeDropdown();
    }, 200);
  }
}
