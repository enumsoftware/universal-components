import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcConfirmationDialog, type UcConfirmationDialogData } from '../uc-confirmation-dialog';

/**
 * The dialog opens through the CDK rather than rendering inline, so the
 * showcase drives a host that opens it - the same way a consuming app would.
 */
@Component({
  selector: 'uc-confirmation-dialog-host',
  imports: [UcButton],
  template: `<uc-button text="Open Confirmation Dialog" (clicked)="openDialog()" />`,
})
export class ConfirmationDialogHost {
  readonly title = input<string>('Delete API Key');
  readonly message = input<string>('Are you sure you want to delete this API key? This action cannot be undone.');
  readonly positiveButtonText = input<string>('Delete');
  readonly negativeButtonText = input<string>('Cancel');

  private readonly dialog = inject(Dialog);

  openDialog(): void {
    const data: UcConfirmationDialogData = {
      title: this.title(),
      message: this.message(),
      positiveButtonText: this.positiveButtonText(),
      negativeButtonText: this.negativeButtonText(),
    };

    this.dialog.open<boolean>(UcConfirmationDialog, { minWidth: '300px', data });
  }
}
