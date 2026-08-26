import { defineShowcase, select, text } from '../workbench/core';
import { INFO_VARIANT_OPTIONS } from './uc-info';
import { InfoPreview } from './examples/info-preview';

export default defineShowcase({
  id: 'components/info',
  group: 'Components',
  title: 'Info',
  layout: 'padded',
  component: InfoPreview,
  knobs: {
    variant: select(INFO_VARIANT_OPTIONS, 'info'),
    heading: text('Information title'),
    body: text('This is an informational message to the user.'),
  },
  examples: [
    {
      name: 'Warning',
      props: { variant: 'warning', heading: 'Warning title', body: 'Please review your input before proceeding.' },
    },
    {
      name: 'Error',
      props: { variant: 'error', heading: 'Error title', body: 'Something went wrong. Please try again.' },
    },
  ],
});
