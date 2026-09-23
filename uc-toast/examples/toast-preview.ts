import { Component, inject, input } from '@angular/core';
import { UcButton } from '../../uc-button/uc-button';
import { UcToastOutlet } from '../uc-toast-outlet';
import { UcToastService, type ToastVariant } from '../uc-toast.service';

/** Toasts are triggered from code, so the showcase drives them with a button. */
@Component({
  selector: 'uc-toast-preview',
  imports: [UcButton, UcToastOutlet],
  template: `
    <uc-button [text]="'Show toast'" (clicked)="show()" />
    <uc-toast-outlet />
  `,
})
export class ToastPreview {
  private readonly toastService = inject(UcToastService);

  readonly variant = input<ToastVariant>('success');
  readonly heading = input<string>('Saved');
  readonly message = input<string>('Your report was submitted.');

  show(): void {
    this.toastService.show(this.message(), { variant: this.variant(), title: this.heading() || undefined });
  }
}
