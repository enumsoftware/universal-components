import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';

export const PILL_VARIANT_OPTIONS = ['default', 'info', 'valid', 'error'] as const;
export type PillVariant = (typeof PILL_VARIANT_OPTIONS)[number];

export const PILL_SIZE_OPTIONS = ['default', 'compact'] as const;
export type PillSize = (typeof PILL_SIZE_OPTIONS)[number];

@Component({
  selector: 'uc-pill',
  imports: [],
  templateUrl: './uc-pill.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-pill.css',
})
export class UcPill {
  text = model<string | null>(null);
  href = input<string | null>(null);
  variant = input<PillVariant>('default');
  size = input<PillSize>('default');
  clicked = output<void>();

  private readonly listenerCount = signal(0);

  /** True while a consumer is listening to `(clicked)`, so the pill only looks interactive when it is. */
  protected readonly isClickable = computed(() => this.listenerCount() > 0);

  constructor() {
    // Angular subscribes to the output when a `(clicked)` binding is set up, so
    // counting subscriptions tells us whether the pill does anything on click.
    const clicked = this.clicked;
    const subscribe = clicked.subscribe.bind(clicked);

    clicked.subscribe = (callback) => {
      this.listenerCount.update((count) => count + 1);
      const subscription = subscribe(callback);
      let active = true;

      return {
        unsubscribe: () => {
          if (!active) {
            return;
          }
          active = false;
          subscription.unsubscribe();
          this.listenerCount.update((count) => count - 1);
        },
      };
    };
  }
}
