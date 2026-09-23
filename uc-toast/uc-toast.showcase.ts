import { defineShowcase, select, text } from '../workbench/core';
import { ToastPreview } from './examples/toast-preview';
import { TOAST_VARIANT_OPTIONS } from './uc-toast.service';

export default defineShowcase({
  id: 'components/toast',
  group: 'Components',
  title: 'Toast',
  layout: 'padded',
  component: ToastPreview,
  knobs: {
    variant: select(TOAST_VARIANT_OPTIONS, 'success'),
    heading: text('Saved'),
    message: text('Your report was submitted.'),
  },
  examples: [
    { name: 'Error', props: { variant: 'error', heading: 'Upload failed', message: 'The photo could not be uploaded.' } },
    { name: 'Without title', props: { variant: 'info', heading: '', message: 'Photos are being processed.' } },
  ],
});
