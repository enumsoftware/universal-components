import { bool, defineShowcase } from '../workbench/core';
import { UcRating } from './uc-rating';

export default defineShowcase({
  id: 'components/rating',
  group: 'Components',
  title: 'Rating',
  component: UcRating,
  knobs: {
    disabled: bool(false),
    readonly: bool(false),
  },
  examples: [
    { name: 'Empty', props: { ariaLabel: 'How was it?' } },
    { name: 'Four stars', props: { value: 4, ariaLabel: 'How was it?' } },
    { name: 'Average (readonly)', props: { value: 3.6, readonly: true } },
    { name: 'Disabled', props: { value: 2, disabled: true } },
  ],
});
