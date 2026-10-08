import { AutoFocusTarget, Dialog, DialogRef, RestoreFocusValue } from '@angular/cdk/dialog';
import {
  ScrollStrategy,
  createBlockScrollStrategy,
  createGlobalPositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector, TemplateRef, ViewContainerRef, inject } from '@angular/core';

import { UcBottomSheetContainer } from './uc-bottom-sheet-container';
import { UcBottomSheetRef } from './uc-bottom-sheet-ref';

/** The `data` passed to `UcBottomSheetService.open()`, injectable inside the sheet's content. */
export const UC_BOTTOM_SHEET_DATA = new InjectionToken<unknown>('UC_BOTTOM_SHEET_DATA');

export interface UcBottomSheetConfig<D = unknown> {
  /** Data for the content, read through `UC_BOTTOM_SHEET_DATA` (or `let-data` in a template). */
  data?: D;
  /** Accessible name, for a sheet without a heading to point `ariaLabelledBy` at. */
  ariaLabel?: string;
  /** Id of the element that names the sheet. */
  ariaLabelledBy?: string;
  /** Whether a backdrop dims the page behind the sheet. Defaults to `true`. */
  hasBackdrop?: boolean;
  /** Classes for the backdrop. Defaults to the themed `cdk-overlay-dark-backdrop`. */
  backdropClass?: string | string[];
  /** Extra classes for the overlay pane. */
  panelClass?: string | string[];
  /** Ignore Escape and backdrop clicks; the content has to call `dismiss()`. Defaults to `false`. */
  disableClose?: boolean;
  /** Where focus goes on open. Defaults to `'dialog'`, the sheet itself, so its name is read out first. */
  autoFocus?: AutoFocusTarget | string | boolean;
  /** Whether focus returns to the previously focused element on close. Defaults to `true`. */
  restoreFocus?: RestoreFocusValue;
  /** Close the sheet when the browser history changes. Defaults to `true`. */
  closeOnNavigation?: boolean;
  /** Minimum height of the sheet, as a CSS length. */
  minHeight?: string;
  /** Maximum height of the sheet, as a CSS length. Defaults to the `--uc-bottom-sheet-max-height` token. */
  maxHeight?: string;
  /** Scroll strategy for the page behind. Defaults to blocking scroll. */
  scrollStrategy?: ScrollStrategy;
  /** Where the content is attached, which decides the injector it resolves from. */
  viewContainerRef?: ViewContainerRef;
  /** Injector for the content, if not the one from `viewContainerRef`. */
  injector?: Injector;
}

/**
 * Opens a panel that slides up from the bottom of the screen, as `MatBottomSheet` does. Only one sheet is
 * open at a time: opening another dismisses the current one.
 */
@Injectable({ providedIn: 'root' })
export class UcBottomSheetService {
  private readonly dialog = inject(Dialog);
  private readonly injector = inject(Injector);
  private openedRef: UcBottomSheetRef<unknown, unknown> | null = null;

  /** The sheet that is currently open, if any. */
  get opened(): UcBottomSheetRef<unknown, unknown> | null {
    return this.openedRef;
  }

  open<T, D = unknown, R = unknown>(
    content: ComponentType<T> | TemplateRef<T>,
    config: UcBottomSheetConfig<D> = {},
  ): UcBottomSheetRef<T, R> {
    this.openedRef?.dismiss();

    let sheetRef!: UcBottomSheetRef<T, R>;

    this.dialog.open<R, D, T>(content, {
      data: config.data,
      container: UcBottomSheetContainer,
      // Escape and backdrop clicks are handled by UcBottomSheetRef so the sheet can animate out.
      disableClose: true,
      hasBackdrop: config.hasBackdrop ?? true,
      backdropClass: config.backdropClass ?? 'cdk-overlay-dark-backdrop',
      panelClass: ['uc-bottom-sheet-panel', ...toArray(config.panelClass)],
      ariaLabel: config.ariaLabel ?? null,
      ariaLabelledBy: config.ariaLabelledBy ?? null,
      autoFocus: config.autoFocus ?? 'dialog',
      restoreFocus: config.restoreFocus ?? true,
      closeOnNavigation: config.closeOnNavigation ?? true,
      maxWidth: '100%',
      minHeight: config.minHeight,
      maxHeight: config.maxHeight,
      positionStrategy: createGlobalPositionStrategy(this.injector).centerHorizontally().bottom('0'),
      scrollStrategy: config.scrollStrategy ?? createBlockScrollStrategy(this.injector),
      viewContainerRef: config.viewContainerRef,
      injector: config.injector,
      providers: (dialogRef, _config, container) => {
        sheetRef = new UcBottomSheetRef<T, R>(
          dialogRef as DialogRef<R, T>,
          container as UcBottomSheetContainer,
          config.disableClose ?? false,
        );
        return [
          { provide: UcBottomSheetRef, useValue: sheetRef },
          { provide: UC_BOTTOM_SHEET_DATA, useValue: config.data },
        ];
      },
      templateContext: () => ({ bottomSheetRef: sheetRef }),
    });

    const opened = sheetRef as UcBottomSheetRef<unknown, unknown>;
    this.openedRef = opened;
    sheetRef.afterDismissed().subscribe(() => {
      if (this.openedRef === opened) {
        this.openedRef = null;
      }
    });

    return sheetRef;
  }

  /** Dismisses the open sheet, if there is one. */
  dismiss<R = unknown>(result?: R): void {
    this.openedRef?.dismiss(result);
  }
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
