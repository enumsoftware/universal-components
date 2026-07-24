import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { UcButton } from '../uc-button/uc-button';
import { UcConfirmationDialog, type UcConfirmationDialogData } from './uc-confirmation-dialog';

@Component({
  selector: 'uc-confirmation-dialog-story-host',
  imports: [UcButton],
  template: `
    <div>
      <uc-button [text]="'Open Confirmation Dialog'" (clicked)="openDialog()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class UcConfirmationDialogStoryHost {
  private readonly dialog = inject(Dialog);

  readonly title = input<string>('Delete API Key');
  readonly message = input<string>('Are you sure you want to delete this API key? This action cannot be undone.');
  readonly positiveButtonText = input<string>('Delete');
  readonly negativeButtonText = input<string>('Cancel');

  openDialog() {
    const data: UcConfirmationDialogData = {
      title: this.title(),
      message: this.message(),
      positiveButtonText: this.positiveButtonText(),
      negativeButtonText: this.negativeButtonText(),
    };

    this.dialog.open<boolean>(UcConfirmationDialog, {
      minWidth: '300px',
      data,
    });
  }
}

const meta: Meta<UcConfirmationDialogStoryHost> = {
  title: 'Components/Confirmation Dialog',
  component: UcConfirmationDialogStoryHost,
  args: {
    title: 'Delete API Key',
    message: 'Are you sure you want to delete this API key? This action cannot be undone.',
    positiveButtonText: 'Delete',
    negativeButtonText: 'Cancel',
  },
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    message: {
      control: { type: 'text' },
    },
    positiveButtonText: {
      control: { type: 'text' },
    },
    negativeButtonText: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<UcConfirmationDialogStoryHost>;

export const Default: Story = {
  args: {
    title: 'Delete Row',
    message: 'Are you sure you want to delete this row? This action cannot be undone.',
  },
};
