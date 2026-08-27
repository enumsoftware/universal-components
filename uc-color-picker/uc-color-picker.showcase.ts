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
  },
  examples: [{ name: 'Disabled', props: { disabled: true, value: '#473bf0' } }],
});
