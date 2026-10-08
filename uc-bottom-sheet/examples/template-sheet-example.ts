import { Component, TemplateRef, inject, signal, viewChild } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcBottomSheetService } from '../uc-bottom-sheet.service';

interface Order {
  id: string;
  total: string;
}

/**
 * Opening an `<ng-template>` instead of a component: the data arrives as `let-order` and the ref as
 * `let-sheetRef="bottomSheetRef"`, so a small sheet needs no component of its own.
 */
@Component({
  selector: 'uc-template-sheet-example',
  imports: [UcButton],
  styles: `
    :host {
      display: grid;
      justify-items: center;
      gap: 0.75rem;
    }

    .result {
      margin: 0;
      color: var(--uc-paragraph-text-color);
    }

    .title {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }

    .message {
      margin: 0 0 1rem;
      color: var(--uc-paragraph-text-color);
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `,
  template: `
    <uc-button text="Cancel Order" variant="error" (clicked)="open()" />
    <p class="result" aria-live="polite">{{ status() }}</p>

    <ng-template #sheet let-order let-sheetRef="bottomSheetRef">
      <h2 class="title" id="cancel-order-title">Cancel order {{ order.id }}?</h2>
      <p class="message">The {{ order.total }} payment is refunded within five working days.</p>
      <div class="actions">
        <uc-button text="Keep Order" variant="secondary" (clicked)="sheetRef.dismiss(false)" />
        <uc-button text="Cancel Order" variant="error" (clicked)="sheetRef.dismiss(true)" />
      </div>
    </ng-template>
  `,
})
export class TemplateSheetExample {
  readonly status = signal('Order #1042 is open.');

  private readonly sheet = viewChild.required<TemplateRef<unknown>>('sheet');
  private readonly bottomSheet = inject(UcBottomSheetService);

  open(): void {
    const ref = this.bottomSheet.open<unknown, Order, boolean>(this.sheet(), {
      data: { id: '#1042', total: '€48.90' },
      ariaLabelledBy: 'cancel-order-title',
    });

    ref.afterDismissed().subscribe((cancelled) => {
      if (cancelled) {
        this.status.set('Order #1042 was cancelled.');
      }
    });
  }
}
