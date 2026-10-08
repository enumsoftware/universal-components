import { Component, TemplateRef, inject, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { UC_BOTTOM_SHEET_DATA, UcBottomSheetService } from './uc-bottom-sheet.service';
import { UcBottomSheetRef } from './uc-bottom-sheet-ref';

@Component({
  selector: 'uc-test-sheet-content',
  template: `<p class="sheet-message">{{ data.message }}</p>`,
})
class SheetContent {
  readonly data = inject<{ message: string }>(UC_BOTTOM_SHEET_DATA);
  readonly sheetRef = inject<UcBottomSheetRef<SheetContent, string>>(UcBottomSheetRef);
}

@Component({
  selector: 'uc-test-sheet-host',
  template: `
    <ng-template #sheet let-data let-sheetRef="bottomSheetRef">
      <button type="button" class="template-button" (click)="sheetRef.dismiss(data)">{{ data }}</button>
    </ng-template>
  `,
})
class TemplateHost {
  readonly sheet = viewChild.required<TemplateRef<unknown>>('sheet');
}

describe('UcBottomSheetService', () => {
  let service: UcBottomSheetService;
  let overlay: HTMLElement;

  beforeEach(() => {
    service = TestBed.inject(UcBottomSheetService);
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
  });

  afterEach(() => {
    service.dismiss();
  });

  function open(message = 'Hello', config = {}) {
    const ref = service.open<SheetContent, { message: string }, string>(SheetContent, {
      data: { message },
      ...config,
    });
    TestBed.tick();
    return ref;
  }

  function pressEscape(): void {
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  }

  it('renders the component inside a named dialog container', () => {
    open('Pick an option', { ariaLabel: 'Share' });

    const container = overlay.querySelector('uc-bottom-sheet-container');
    expect(container).toBeTruthy();
    expect(container?.getAttribute('role')).toBe('dialog');
    expect(container?.getAttribute('aria-label')).toBe('Share');
    expect(overlay.querySelector('.sheet-message')?.textContent).toBe('Pick an option');
  });

  it('injects the ref into the content and exposes the instance', () => {
    const ref = open();

    expect(ref.instance).toBeInstanceOf(SheetContent);
    expect(ref.instance?.sheetRef).toBe(ref);
  });

  it('hands the dismiss result to afterDismissed and removes the sheet', () => {
    const ref = open();
    let result: string | undefined;
    ref.afterDismissed().subscribe((value) => (result = value));

    ref.instance?.sheetRef.dismiss('copied');

    expect(result).toBe('copied');
    expect(overlay.querySelector('uc-bottom-sheet-container')).toBeNull();
    expect(service.opened).toBeNull();
  });

  it('closes on Escape', () => {
    const ref = open();
    let dismissed = false;
    ref.afterDismissed().subscribe(() => (dismissed = true));

    pressEscape();

    expect(dismissed).toBe(true);
  });

  it('ignores Escape and backdrop clicks when disableClose is set', () => {
    const ref = open('Hello', { disableClose: true });
    let dismissed = false;
    ref.afterDismissed().subscribe(() => (dismissed = true));

    pressEscape();
    (overlay.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();

    expect(dismissed).toBe(false);
    expect(service.opened).toBe(ref);
  });

  it('closes on a backdrop click', () => {
    const ref = open();
    let dismissed = false;
    ref.afterDismissed().subscribe(() => (dismissed = true));

    (overlay.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();

    expect(dismissed).toBe(true);
  });

  it('keeps only one sheet open at a time', () => {
    const first = open('First');
    let firstDismissed = false;
    first.afterDismissed().subscribe(() => (firstDismissed = true));

    const second = open('Second');

    expect(firstDismissed).toBe(true);
    expect(service.opened).toBe(second);
    expect(overlay.querySelectorAll('uc-bottom-sheet-container').length).toBe(1);
  });

  it('opens a template with the data and the ref in its context', () => {
    const fixture = TestBed.createComponent(TemplateHost);
    fixture.detectChanges();

    const ref = service.open<unknown, string, string>(fixture.componentInstance.sheet(), { data: 'Done' });
    TestBed.tick();
    let result: string | undefined;
    ref.afterDismissed().subscribe((value) => (result = value));

    const button = overlay.querySelector('.template-button') as HTMLButtonElement;
    expect(button.textContent).toBe('Done');
    button.click();

    expect(result).toBe('Done');
  });
});
