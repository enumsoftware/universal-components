import { bool, defineShowcase, select, text } from '../workbench/core';
import { SegmentedTogglePreview } from './examples/segmented-toggle-preview';
import { CompactExample, TextOnlyExample } from './examples/text-options';
import { WithFlagsExample } from './examples/with-flags';
import { SEGMENTED_TOGGLE_VARIANT_OPTIONS } from './uc-segmented-toggle';

export default defineShowcase({
  id: 'components/segmented-toggle',
  group: 'Components',
  title: 'Segmented Toggle',
  layout: 'padded',
  component: SegmentedTogglePreview,
  knobs: {
    value: text('all'),
    disabled: bool(false),
    variant: select(SEGMENTED_TOGGLE_VARIANT_OPTIONS, 'default'),
  },
  examples: [
    {
      name: 'Default',
      description: 'A padded track with the selected option as a rounded pill inside it, and no dividers.',
      props: {},
    },
    { name: 'Text Only', component: TextOnlyExample },
    {
      name: 'Compact',
      description: 'Sized down with the component tokens; the option corners stay nested inside the track.',
      component: CompactExample,
    },
    { name: 'Pills', props: { variant: 'pills' } },
    { name: 'With Flags', component: WithFlagsExample },
    { name: 'Disabled Group', props: { disabled: true } },
  ],
});
