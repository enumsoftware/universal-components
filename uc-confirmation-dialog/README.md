# UcConfirmationDialog

Reusable confirmation dialog content component for Angular CDK dialog flows.

## Data contract

Use `UcConfirmationDialogData` as the dialog payload:

- `title`: dialog heading
- `message`: dialog body text
- `positiveButtonText` (optional): confirm action label, defaults to `Yes`
- `negativeButtonText` (optional): cancel action label, defaults to `No`

## Example

```ts
import { Dialog } from '@angular/cdk/dialog';
import { UcConfirmationDialog, UcConfirmationDialogData } from '@enumsoftware/universal-components';

const dialog = inject(Dialog);

dialog.open<boolean>(UcConfirmationDialog, {
  data: {
    title: 'Delete item',
    message: 'Are you sure you want to delete this item?',
    positiveButtonText: 'Delete',
    negativeButtonText: 'Cancel',
  } as UcConfirmationDialogData,
});
```
