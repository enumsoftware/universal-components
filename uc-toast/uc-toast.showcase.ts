import { defineShowcase, number, select, text } from '../workbench/core';
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
    duration: number<number | null>(null, {
      description: 'Milliseconds before the toast closes. 0 keeps it open until closed; empty uses the default (5000, or 8000 for errors).',
      min: 0,
      step: 500,
    }),
  },
  examples: [
    { name: 'Error', props: { variant: 'error', heading: 'Upload failed', message: 'The photo could not be uploaded.' } },
    { name: 'Without title', props: { variant: 'info', heading: '', message: 'Photos are being processed.' } },
    { name: 'Short', props: { heading: 'Copied', message: 'The link is on your clipboard.', duration: 2000 } },
    { name: 'Stays open', props: { variant: 'warning', heading: 'Offline', message: 'Changes will sync when you reconnect.', duration: 0 } },
  ],
});
