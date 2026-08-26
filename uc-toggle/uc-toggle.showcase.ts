import { bool, defineShowcase } from '../workbench/core';
import { UcToggle } from './uc-toggle';

export default defineShowcase({
  id: 'components/toggle',
  group: 'Components',
  title: 'Toggle',
  component: UcToggle,
  knobs: {
    checked: bool(false),
    disabled: bool(false),
  },
  examples: [
    { name: 'On', props: { checked: true } },
    { name: 'Disabled', props: { disabled: true } },
    { name: 'Disabled On', props: { checked: true, disabled: true } },
  ],
});
