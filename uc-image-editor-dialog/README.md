# UcImageEditorDialog

A CDK Dialog that lets users crop and adjust an image before upload. Opened programmatically — typically by `UcFilePicker` when `editImages` is `true`.

## Features

- **Canvas-based crop**: Interactive drag-to-crop with corner handles
- **Aspect ratio presets**: Free, 1:1, 16:9, 9:16
- **Flip controls**: Horizontal and vertical flip
- **Rotation**: 90° step rotation
- **Brightness / contrast sliders**: Basic image adjustments
- **Max working dimension**: Caps internal canvas size at 4096 px to protect performance
- **CDK Dialog**: Opened via Angular CDK `Dialog.open()`

## Usage

The dialog is opened via Angular CDK `Dialog`, not declared in a template.

```typescript
import { Dialog } from '@angular/cdk/dialog';
import { UcImageEditorDialog, UcImageEditorDialogData } from '@enumsoftware/universal-components';

@Component({ ... })
export class MyComponent {
  private dialog = inject(Dialog);

  openEditor(file: File) {
    const ref = this.dialog.open<File | null, UcImageEditorDialogData>(UcImageEditorDialog, {
      data: { file, title: 'Crop your photo' },
    });

    ref.closed.subscribe((result) => {
      if (result) {
        // result is the edited File
      }
    });
  }
}
```

## Dialog Data

```typescript
type UcImageEditorDialogData = {
  file: File;      // The image file to edit
  title?: string;  // Optional dialog header title (default: 'Edit image')
};
```

## Return Value

`dialog.open().closed` emits:
- A `File` containing the cropped/adjusted image on **Save**
- `null` or `undefined` on **Cancel** / dismiss

## Notes

- The dialog is self-contained and does not expose public inputs beyond the `DIALOG_DATA` token.
- `UcFilePicker` handles opening this dialog automatically when `editImages` is `true`.
