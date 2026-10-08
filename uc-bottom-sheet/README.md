# UcBottomSheet

A panel that slides up from the bottom of the screen, for a short list of actions or a quick decision -
the same idea as Angular Material's `MatBottomSheet`.

## Features

- Opens a component or an `<ng-template>` through `UcBottomSheetService`, on top of the CDK dialog, so the
  focus trap, focus restore and `role="dialog"` come from the CDK
- Slides in and out; Escape and a backdrop click animate out too. No animation under
  `prefers-reduced-motion`
- One sheet at a time: opening another dismisses the current one
- `UcBottomSheetRef` to dismiss with a result and to listen for `afterOpened()` / `afterDismissed()`
- Full width on phones, centred with a capped width on wider screens, clear of the home indicator
- Themed with `--uc-bottom-sheet-*` tokens

## Basic Usage

Write the content as a component. It can inject the ref and the data:

```typescript
import { UC_BOTTOM_SHEET_DATA, UcBottomSheetRef } from '@enumsoftware/universal-components';

@Component({
  selector: 'app-share-sheet',
  template: `
    <h2 id="share-title">Share {{ data.title }}</h2>
    <button type="button" (click)="sheetRef.dismiss('link')">Copy link</button>
    <button type="button" (click)="sheetRef.dismiss('email')">Email</button>
  `,
})
export class ShareSheet {
  readonly sheetRef = inject<UcBottomSheetRef<ShareSheet, string>>(UcBottomSheetRef);
  readonly data = inject<{ title: string }>(UC_BOTTOM_SHEET_DATA);
}
```

Open it from anywhere with the service:

```typescript
import { UcBottomSheetService } from '@enumsoftware/universal-components';

export class ArticlePage {
  private readonly bottomSheet = inject(UcBottomSheetService);

  share(): void {
    const ref = this.bottomSheet.open<ShareSheet, { title: string }, string>(ShareSheet, {
      data: { title: 'this article' },
      ariaLabelledBy: 'share-title',
    });

    ref.afterDismissed().subscribe((choice) => {
      // 'link', 'email', or undefined when closed with Escape or the backdrop
    });
  }
}
```

## From a Template

A small sheet does not need a component. The data is the template's implicit context and the ref is
`bottomSheetRef`:

```html
<ng-template #confirm let-order let-sheetRef="bottomSheetRef">
  <p>Cancel order {{ order.id }}?</p>
  <uc-button text="Keep" variant="secondary" (clicked)="sheetRef.dismiss(false)" />
  <uc-button text="Cancel order" variant="error" (clicked)="sheetRef.dismiss(true)" />
</ng-template>
```

```typescript
this.bottomSheet.open(this.confirm(), { data: { id: '#1042' }, ariaLabel: 'Cancel order' });
```

## Config

| Option              | Default                     | Description                                                     |
| ------------------- | --------------------------- | --------------------------------------------------------------- |
| `data`              | -                           | Read through `UC_BOTTOM_SHEET_DATA`, or `let-data` in a template |
| `ariaLabel`         | -                           | Accessible name, when there is no heading to point at           |
| `ariaLabelledBy`    | -                           | Id of the element that names the sheet                          |
| `hasBackdrop`       | `true`                      | Dim the page behind the sheet                                   |
| `backdropClass`     | `cdk-overlay-dark-backdrop` | Classes for the backdrop                                        |
| `panelClass`        | -                           | Extra classes for the overlay pane                              |
| `disableClose`      | `false`                     | Ignore Escape and backdrop clicks                               |
| `autoFocus`         | `'dialog'`                  | Where focus goes on open                                        |
| `restoreFocus`      | `true`                      | Return focus to the opener on close                             |
| `closeOnNavigation` | `true`                      | Close when the browser history changes                          |
| `minHeight`         | -                           | CSS length                                                      |
| `maxHeight`         | `--uc-bottom-sheet-max-height` | CSS length                                                   |
| `scrollStrategy`    | block                       | Scroll behaviour of the page behind                             |
| `viewContainerRef`  | -                           | Where the content is attached (decides its injector)            |
| `injector`          | -                           | Injector for the content                                        |

Give every sheet a name, with `ariaLabelledBy` pointing at its heading or with `ariaLabel`.

## UcBottomSheetRef

| Member              | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| `dismiss(result?)`  | Slide out and close, handing `result` to `afterDismissed()`        |
| `afterOpened()`     | Emits once the sheet has slid in                                  |
| `afterDismissed()`  | Emits the result (or `undefined`) once the sheet is gone          |
| `backdropClick()`   | Emits on every backdrop click, whether or not it closes the sheet |
| `keydownEvents()`   | Keydown events for the sheet's overlay                            |
| `disableClose`      | Can be changed while the sheet is open                            |
| `instance`          | The content component, or `null` for a template                   |

`UcBottomSheetService` also has `opened` (the open sheet's ref, or `null`) and `dismiss(result?)`.

## Theming

```css
--uc-bottom-sheet-background
--uc-bottom-sheet-color
--uc-bottom-sheet-border-radius
--uc-bottom-sheet-box-shadow
--uc-bottom-sheet-padding
--uc-bottom-sheet-max-width
--uc-bottom-sheet-max-height
--uc-bottom-sheet-animation-duration
```

The backdrop is the shared dialog one, `--uc-dialog-backdrop-background`.
