import { bool, defineShowcase, text } from '../workbench/core';
import { ButtonTogglePreview } from './examples/button-toggle-preview';

export default defineShowcase({
  id: 'components/button-toggle',
  group: 'Components',
  title: 'Button Toggle',
  layout: 'padded',
  component: ButtonTogglePreview,
  knobs: {
    value: text('all'),
    disabled: bool(false),
  },
  examples: [{ name: 'Disabled Group', props: { disabled: true } }],
});
