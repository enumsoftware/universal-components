import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UcButton } from '../uc-button/uc-button';

export type UcConfirmationDialogData = {
  title: string;
  message: string;
  positiveButtonText?: string;
  negativeButtonText?: string;
};

@Component({
  selector: 'uc-confirmation-dialog',
  imports: [UcButton],
  templateUrl: './uc-confirmation-dialog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-confirmation-dialog.css',
})
export class UcConfirmationDialog {
  private static nextId = 0;

  readonly positiveButtonText = signal('Yes');
  readonly negativeButtonText = signal('No');
  readonly message = signal('Are you sure?');
  readonly title = signal('Confirm');

  readonly instanceId = `uc-confirmation-dialog-${UcConfirmationDialog.nextId++}`;
  readonly titleId = `${this.instanceId}-title`;
  readonly messageId = `${this.instanceId}-message`;

  private readonly dialogData = inject<UcConfirmationDialogData | null>(DIALOG_DATA, {
    optional: true,
  });

  private readonly dialogRef = inject<DialogRef<boolean> | null>(DialogRef, {
    optional: true,
  });

  constructor() {
    if (!this.dialogData) {
      return;
    }

    this.message.set(this.dialogData.message);
    this.title.set(this.dialogData.title);

    if (this.dialogData.positiveButtonText) {
      this.positiveButtonText.set(this.dialogData.positiveButtonText);
    }

    if (this.dialogData.negativeButtonText) {
      this.negativeButtonText.set(this.dialogData.negativeButtonText);
    }
  }

  positiveClicked() {
    this.dialogRef?.close(true);
  }

  negativeClicked() {
    this.dialogRef?.close(false);
  }
}
