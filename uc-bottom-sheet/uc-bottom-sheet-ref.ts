import { DialogRef } from '@angular/cdk/dialog';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { Observable, filter } from 'rxjs';

import type { UcBottomSheetContainer } from './uc-bottom-sheet-container';

/**
 * Handle to an open bottom sheet, returned by `UcBottomSheetService.open()` and injectable inside the
 * sheet's content component.
 */
export class UcBottomSheetRef<T = unknown, R = unknown> {
  /** Whether Escape and a backdrop click are ignored. Can be changed while the sheet is open. */
  disableClose: boolean;

  private readonly closed: Observable<R | undefined>;

  constructor(
    private readonly dialogRef: DialogRef<R, T>,
    private readonly container: UcBottomSheetContainer,
    disableClose: boolean,
  ) {
    this.disableClose = disableClose;
    this.closed = dialogRef.closed;

    // The CDK dialog is opened with its own disableClose set, so that these two paths animate out
    // through dismiss() instead of being torn down on the spot.
    dialogRef.backdropClick.subscribe(() => {
      if (!this.disableClose) {
        this.dismiss();
      }
    });

    dialogRef.keydownEvents
      .pipe(filter((event) => event.key === 'Escape' && !hasModifierKey(event)))
      .subscribe((event) => {
        if (!this.disableClose) {
          event.preventDefault();
          this.dismiss();
        }
      });
  }

  /** The component opened into the sheet, or `null` when it was opened from a template or has closed. */
  get instance(): T | null {
    return this.dialogRef.componentInstance;
  }

  /** Slides the sheet out and closes it, handing `result` to `afterDismissed()`. */
  dismiss(result?: R): void {
    this.container.exit(() => this.dialogRef.close(result));
  }

  /** Emits once the sheet has finished sliding in. */
  afterOpened(): Observable<void> {
    return this.container.entered;
  }

  /** Emits the dismiss result (or `undefined`) once the sheet is gone, then completes. */
  afterDismissed(): Observable<R | undefined> {
    return this.closed;
  }

  /** Emits when the backdrop is clicked, whether or not that closes the sheet. */
  backdropClick(): Observable<MouseEvent> {
    return this.dialogRef.backdropClick;
  }

  /** Keydown events targeted at the sheet's overlay. */
  keydownEvents(): Observable<KeyboardEvent> {
    return this.dialogRef.keydownEvents;
  }
}
