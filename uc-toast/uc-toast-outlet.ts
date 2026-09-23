import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { UcToastService, type ToastVariant } from './uc-toast.service';

const ICONS: Record<ToastVariant, string> = {
  success: 'ph-check-circle',
  info: 'ph-info',
  warning: 'ph-warning',
  error: 'ph-warning-circle',
};

/**
 * Renders the toasts from `UcToastService`. Place it once, near the root of the app.
 * Errors are announced assertively, everything else politely.
 */
@Component({
  selector: 'uc-toast-outlet',
  templateUrl: './uc-toast-outlet.html',
  styleUrl: './uc-toast-outlet.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcToastOutlet {
  protected readonly toastService = inject(UcToastService);

  closeLabel = input<string>('Close');

  protected iconFor(variant: ToastVariant): string {
    return ICONS[variant];
  }
}
