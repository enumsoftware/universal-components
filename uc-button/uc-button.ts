import {
  afterNextRender,
  booleanAttribute,
  Component,
  input,
  model,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UcSpinnerLoading } from '../uc-spinner-loading/uc-spinner-loading.component';

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
  imports: [UcSpinnerLoading],
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
   * The consumer owns the loading state. Keep this an `input` rather than a `model` so callers can
   * bind a derived signal straight in, for example `[loading]="resource.isLoading()"`.
   */
  loading = input<boolean>(false);

  /**
   * Optional label shown next to the spinner. Leaving it unset keeps the button at its resting
   * width while loading; setting it swaps the label, which reflows the button.
   */
  loadingText = input<string | undefined>(undefined);

  /**
   * Turns the button into a toggle: it gets `aria-pressed` and flips `pressed` on click. A toggle
   * uses its own on/off styling instead of `variant`, so the two states always read the same way.
   */
  isToggleEnabled = input(false, { transform: booleanAttribute });

  /**
   * Toggle state; ignored unless `isToggleEnabled` is set. Bind it two-way to let the button flip
   * itself, or one-way to drive it from state the host already owns. Keep `text` the same in both
   * states: the pressed state is announced for you.
   */
  pressed = model<boolean>(false);

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
    // Only a blocked click is cancelled; otherwise a submit or reset button must keep its
    // default action, or the surrounding form would never submit.
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      return;
    }

    if (this.isToggleEnabled()) {
      this.pressed.set(!this.pressed());
    }

    this.clicked.emit();
  }
}
