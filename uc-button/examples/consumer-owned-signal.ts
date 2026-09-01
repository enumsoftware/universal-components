import { Component, signal } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/**
 * The consumer owns the state: a signal flipped around the async call. The
 * button stays dumb, and the repeated clicks show that it refuses to re-emit
 * while a request is in flight.
 */
@Component({
  selector: 'uc-button-consumer-owned-signal-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Save invoice" [loading]="saving()" (clicked)="save()">
      <i ucButtonPrefix class="ph-bold ph-floppy-disk"></i>
    </uc-button>
    <span>Emitted clicks: {{ clickCount() }}</span>
  `,
})
export class ConsumerOwnedSignalExample {
  readonly saving = signal(false);
  readonly clickCount = signal(0);

  save(): void {
    if (this.saving()) {
      return;
    }

    this.clickCount.update((count) => count + 1);
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 2000);
  }
}
