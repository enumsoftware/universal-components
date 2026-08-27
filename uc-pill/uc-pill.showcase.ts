import { defineShowcase, select, text } from '../workbench/core';
import { PILL_SIZE_OPTIONS, PILL_VARIANT_OPTIONS, UcPill } from './uc-pill';

export default defineShowcase({
  id: 'components/pill',
  group: 'Components',
  title: 'Pill',
  component: UcPill,
  knobs: {
    text: text('Active'),
    variant: select(PILL_VARIANT_OPTIONS, 'default'),
    size: select(PILL_SIZE_OPTIONS, 'default'),
  },
  examples: [
    { name: 'Long Text', props: { text: 'In Progress' } },
    { name: 'Table Info', props: { text: 'Pending', variant: 'info', size: 'compact' } },
    { name: 'Table Valid', props: { text: 'Active', variant: 'valid', size: 'compact' } },
    { name: 'Table Error', props: { text: 'Inactive', variant: 'error', size: 'compact' } },
    {
      name: 'Clickable',
      description: 'Every pill emits `clicked`; press one and watch the Actions panel.',
      props: { text: 'Click me' },
    },
  ],
});
