import { Injectable, signal } from '@angular/core';

export const TOAST_VARIANT_OPTIONS = ['success', 'info', 'warning', 'error'] as const;
export type ToastVariant = (typeof TOAST_VARIANT_OPTIONS)[number];

export interface UcToastOptions {
  variant?: ToastVariant;
  title?: string;
  /** Milliseconds before the toast closes itself. 0 keeps it open until dismissed. */
  duration?: number;
}

export interface UcToast {
  id: number;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration: number;
}

/**
 * Queue of toast messages shown by `<uc-toast-outlet />`. Place the outlet once in the app
 * root, then call `show()` from anywhere.
 */
@Injectable({ providedIn: 'root' })
export class UcToastService {
  private nextId = 1;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly toasts = signal<readonly UcToast[]>([]);

  show(message: string, options: UcToastOptions = {}): number {
    const variant = options.variant ?? 'info';
    const toast: UcToast = {
      id: this.nextId++,
      message,
      title: options.title,
      variant,
      duration: options.duration ?? (variant === 'error' ? 8000 : 5000),
    };

    this.toasts.update((toasts) => [...toasts, toast]);

    if (toast.duration > 0) {
      this.timers.set(
        toast.id,
        setTimeout(() => this.dismiss(toast.id), toast.duration),
      );
    }

    return toast.id;
  }

  success(message: string, title?: string): number {
    return this.show(message, { variant: 'success', title });
  }

  error(message: string, title?: string): number {
    return this.show(message, { variant: 'error', title });
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.toasts.set([]);
  }
}
