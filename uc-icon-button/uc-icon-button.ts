import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

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

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.clicked.emit();
  }
}
