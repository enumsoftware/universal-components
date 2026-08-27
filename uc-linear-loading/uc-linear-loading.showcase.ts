import { bool, defineShowcase, text } from '../workbench/core';
import { UcLinearLoading } from './uc-linear-loading.component';

export default defineShowcase({
  id: 'components/linear-loading',
  group: 'Components',
  title: 'Linear Loading',
  // The host is already `display: block; width: 100%`, so it fills a padded
  // canvas without the fixed-width wrapper the story used to need.
  layout: 'padded',
  component: UcLinearLoading,
  knobs: {
    loading: bool(true),
    color: text(undefined, { placeholder: 'Defaults to the primary colour' }),
  },
  examples: [
    { name: 'Not Loading', props: { loading: false } },
    { name: 'Custom Color', props: { loading: true, color: '#ff5733' } },
  ],
});
