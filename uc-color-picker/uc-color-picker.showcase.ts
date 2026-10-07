import { bool, defineShowcase, text } from '../workbench/core';
import { UcColorPicker } from './uc-color-picker';

export default defineShowcase({
  id: 'components/color-picker',
  group: 'Components',
  title: 'Color Picker',
  component: UcColorPicker,
  knobs: {
    id: text('color-picker-1'),
    label: text('Brand color'),
    value: text('#473bf0'),
    disabled: bool(false),
    readonly: bool(false),
  },
  examples: [
    {
      name: 'Custom Color',
      description: 'Open it and paste a colour such as rgb(233, 30, 99) or hsl(340, 82%, 52%) into the value field.',
      props: { id: 'color-picker-custom', label: 'Accent color', value: '#e91e63' },
    },
    { name: 'Without Label', props: { id: 'color-picker-unlabelled', label: '', value: '#00b69b' } },
    { name: 'Read-only', props: { id: 'color-picker-readonly', readonly: true, value: '#ff9800' } },
    { name: 'Disabled', props: { id: 'color-picker-disabled', disabled: true, value: '#473bf0' } },
  ],
});
