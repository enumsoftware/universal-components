import { Component, computed, input, model, output, ChangeDetectionStrategy } from '@angular/core';

export const ICON_BUTTON_VARIANT_OPTIONS = ['primary', 'secondary', 'error'] as const;
export type IconButtonVariant = (typeof ICON_BUTTON_VARIANT_OPTIONS)[number];

@Component({
  selector: 'uc-icon-button',
  templateUrl: './uc-icon-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-icon-button.css',
})
export class UcIconButton {
  inverseColor = input<boolean>(false);
  clicked = output<void>();
  disabled = input<boolean>(false);
  label = input<string>('');
  phosphorIcon = input<string>('');
  phosphorWeight = input<string>('bold');
  variant = input<IconButtonVariant>('primary');

  /**
   * Toggle state, kept separate from `variant` so pressed and emphasis stay independent axes.
   * `null` leaves the button a plain action with no `aria-pressed`; a boolean turns it into a
   * toggle. Bind it two-way to let the button flip itself, or one-way to drive it from state the
   * host already owns.
   */
  pressed = model<boolean | null>(null);

  readonly isToggle = computed(() => this.pressed() !== null);

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    event.preventDefault();

    if (this.isToggle()) {
      this.pressed.set(!this.pressed());
    }

    this.clicked.emit();
  }
}
