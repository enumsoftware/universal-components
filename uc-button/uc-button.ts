import {
  afterNextRender,
  Component,
  input,
  model,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

export const BUTTON_VARIANT_OPTIONS = ['primary', 'secondary', 'error'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANT_OPTIONS)[number];

export const BUTTON_ALIGN_OPTIONS = ['left', 'center'] as const;
export type ButtonAlign = (typeof BUTTON_ALIGN_OPTIONS)[number];

export const BUTTON_TYPE_OPTIONS = ['button', 'submit', 'reset'] as const;
export type ButtonType = (typeof BUTTON_TYPE_OPTIONS)[number];

export const BUTTON_SIZE_OPTIONS = ['small', 'medium', 'big'] as const;
export type ButtonSize = (typeof BUTTON_SIZE_OPTIONS)[number];

@Component({
  selector: 'uc-button',
  templateUrl: './uc-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-button.css',
})
export class UcButton {
  text = model.required();
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  align = input<ButtonAlign>('center');
  disabled = input<boolean>(false);
  clicked = output<void>();
  type = input<ButtonType>('button');

  /**
   * Color transitions stay off until the frame after the variant and size classes have been
   * rendered, so the button never animates from its unstyled colors to its variant colors.
   */
  readonly transitionsEnabled = signal(false);

  constructor() {
    afterNextRender(() => {
      requestAnimationFrame(() => this.transitionsEnabled.set(true));
    });
  }

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.clicked.emit();
  }
}
