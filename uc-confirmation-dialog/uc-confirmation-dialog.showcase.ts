import { defineShowcase, text } from '../workbench/core';
import { ConfirmationDialogHost } from './examples/dialog-host';

export default defineShowcase({
  id: 'components/confirmation-dialog',
  group: 'Components',
  title: 'Confirmation Dialog',
  component: ConfirmationDialogHost,
  knobs: {
    title: text('Delete API Key'),
    message: text('Are you sure you want to delete this API key? This action cannot be undone.'),
    positiveButtonText: text('Delete'),
    negativeButtonText: text('Cancel'),
  },
  examples: [
    {
      name: 'Delete Row',
      props: {
        title: 'Delete Row',
        message: 'Are you sure you want to delete this row? This action cannot be undone.',
      },
    },
  ],
});
