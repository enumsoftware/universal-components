import { Injectable, signal } from '@angular/core';

export const TOAST_VARIANT_OPTIONS = ['success', 'info', 'warning', 'error'] as const;
export type ToastVariant = (typeof TOAST_VARIANT_OPTIONS)[number];

/** A button on a toast. Leave the action out of the options to hide its button. */
export interface UcToastAction {
  text: string;
  /** Runs when the button is clicked. */
  onClick?: () => void;
  /** Closes the toast after `onClick`. Defaults to true. */
  dismiss?: boolean;
}

export interface UcToastOptions {
  variant?: ToastVariant;
  title?: string;
  /**
   * Milliseconds before the toast closes itself. 0 keeps it open until dismissed.
   * Defaults to 5000 (8000 for errors), or 0 when the toast has an action, so the
   * user is not racing a timer to click it.
   */
  duration?: number;
  /** The main action, shown as a primary button. */
  positiveAction?: UcToastAction;
  /** The secondary action (for example "Later"), shown as a text button. */
  negativeAction?: UcToastAction;
}

export interface UcToast {
  id: number;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration: number;
  positiveAction?: UcToastAction;
  negativeAction?: UcToastAction;
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
    const hasAction = !!(options.positiveAction || options.negativeAction);
    const toast: UcToast = {
      id: this.nextId++,
      message,
      title: options.title,
      variant,
      duration: options.duration ?? (hasAction ? 0 : variant === 'error' ? 8000 : 5000),
      positiveAction: options.positiveAction,
      negativeAction: options.negativeAction,
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

  /** Runs an action of the toast and closes it unless the action says otherwise. */
  runAction(id: number, action: UcToastAction): void {
    action.onClick?.();
    if (action.dismiss !== false) {
      this.dismiss(id);
    }
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
