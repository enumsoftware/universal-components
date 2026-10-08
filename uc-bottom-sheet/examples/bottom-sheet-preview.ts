import { Component, inject, input, signal } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcBottomSheetService } from '../uc-bottom-sheet.service';
import { ShareSheet } from './share-sheet';

/**
 * A bottom sheet opens through a service rather than rendering inline, so the showcase drives a host that
 * opens it - the same way a consuming app would - and shows what the sheet was dismissed with.
 */
@Component({
  selector: 'uc-bottom-sheet-preview',
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
  `,
  template: `
    <uc-button text="Open Bottom Sheet" (clicked)="open()" />
    <p class="result" aria-live="polite">Dismissed with: {{ result() }}</p>
  `,
})
export class BottomSheetPreview {
  readonly ariaLabel = input<string>('Share this page');
  readonly hasBackdrop = input<boolean>(true);
  readonly disableClose = input<boolean>(false);

  readonly result = signal('-');

  private readonly bottomSheet = inject(UcBottomSheetService);

  open(): void {
    const ref = this.bottomSheet.open<ShareSheet, unknown, string>(ShareSheet, {
      ariaLabel: this.ariaLabel(),
      hasBackdrop: this.hasBackdrop(),
      disableClose: this.disableClose(),
    });

    ref.afterDismissed().subscribe((result) => this.result.set(result ?? 'nothing'));
  }
}
