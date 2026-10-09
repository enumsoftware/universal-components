# UcBottomSheet

A panel along the bottom of the screen, in two modes:

- **Modal**, opened through `UcBottomSheetService`: a short list of actions or a quick decision that takes
  focus until it is dismissed - the same idea as Angular Material's `MatBottomSheet`.
- **Inline**, the `<uc-bottom-sheet>` component placed in the page: a list that stays open over a map or
  other content, dragged between snap heights, with everything behind it still usable. See
  [Inline Sheet](#inline-sheet).

Everything up to the Inline Sheet section is about the modal sheet.

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

## Inline Sheet

`<uc-bottom-sheet>` is not a dialog. It sits over the bottom of its nearest positioned ancestor (or of the
viewport, with `fixed`). Nothing traps focus, there is no backdrop, and Escape and navigation leave it alone,
so it suits a list that has to stay open over a usable map.

```html
<div class="map-page">
  <google-map ... />

  <uc-bottom-sheet label="Bus lines" [snapPoints]="['5.5rem', '50%', '85%']" [(snapIndex)]="sheetIndex">
    <h2 ucBottomSheetHeader>Bus lines</h2>
    <ul>...</ul>
  </uc-bottom-sheet>
</div>
```

```css
.map-page {
  position: relative;
  height: 100dvh;
}
```

- **Snap points** are the heights it rests at, lowest first: px (a number or `'120px'`), `'5rem'`, or a
  percentage of the container. Make the lowest one tall enough to show the header.
- **Dragging** the handle or the `ucBottomSheetHeader` content follows the pointer and settles on the nearest
  snap point; a flick goes to the next one in its direction. Buttons in the header still take a click, since
  a press only becomes a drag after a few pixels of travel.
- **The handle** is a vertical slider for keyboard and screen reader users: the arrow keys, Page Up/Down,
  Home and End move between snap points, and a click steps up and wraps back to the lowest. Name the steps
  with `snapLabels`, e.g. `['Collapsed', 'Half', 'Expanded']`; they are read out as the slider's value.
- **Focus** that lands on content the sheet is hiding, by tabbing into it while collapsed, raises the sheet
  a step.
- **`label`** makes the sheet a named region landmark.

| Input         | Default                  | Description                                             |
| ------------- | ------------------------ | ------------------------------------------------------- |
| `snapPoints`  | `['5rem', '50%', '90%']` | Heights it rests at, lowest first                       |
| `snapIndex`   | `0`                      | Current snap point; two-way (`[(snapIndex)]`)           |
| `label`       | `''`                     | Accessible name; makes it a region landmark             |
| `handleLabel` | `'Sheet height'`         | Accessible name of the handle                           |
| `snapLabels`  | `[]`                     | Announced name of each snap point                       |
| `fixed`       | `false`                  | Pin to the viewport instead of the positioned container |

`snapTo(index)` moves it from code. The body scrolls on its own; dragging the content itself, rather than
the handle or header, does not move the sheet.

It uses the same `--uc-bottom-sheet-*` tokens as the modal sheet (except `max-height`), plus
`--uc-bottom-sheet-handle-color` and `--uc-bottom-sheet-z-index`.
