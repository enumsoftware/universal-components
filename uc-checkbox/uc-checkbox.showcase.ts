import { bool, defineShowcase, text } from '../workbench/core';
import { UcCheckbox } from './uc-checkbox';

export default defineShowcase({
  id: 'components/checkbox',
  group: 'Components',
  title: 'Checkbox',
  component: UcCheckbox,
  knobs: {
    id: text('checkbox-1'),
    label: text('Accept terms and conditions'),
    checked: bool(false),
    disabled: bool(false),
  },
  examples: [
    { name: 'Checked', props: { checked: true } },
    { name: 'Disabled', props: { disabled: true } },
    { name: 'Disabled Checked', props: { checked: true, disabled: true } },
  ],
});
