import { bool, defineShowcase, text } from '../workbench/core';
import { SegmentedTogglePreview } from './examples/segmented-toggle-preview';

export default defineShowcase({
  id: 'components/segmented-toggle',
  group: 'Components',
  title: 'Segmented Toggle',
  layout: 'padded',
  component: SegmentedTogglePreview,
  knobs: {
    value: text('all'),
    disabled: bool(false),
  },
  examples: [{ name: 'Disabled Group', props: { disabled: true } }],
});
