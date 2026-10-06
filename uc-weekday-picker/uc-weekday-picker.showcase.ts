import { bool, defineShowcase, text } from '../workbench/core';
import { WeekdayPickerPreview } from './examples/weekday-picker-preview';

export default defineShowcase({
  id: 'components/weekday-picker',
  group: 'Components',
  title: 'Weekday Picker',
  layout: 'padded',
  component: WeekdayPickerPreview,
  knobs: {
    label: text('Runs on'),
    locale: text(''),
    disabled: bool(false),
  },
  examples: [
    {
      name: 'Default',
      description: 'Monday to Friday chosen; the first day and the names follow the locale.',
      props: {},
    },
    {
      name: 'Croatian',
      description: 'hr-HR starts on Monday and names the days in Croatian.',
      props: { locale: 'hr-HR', label: 'Vozi' },
    },
    { name: 'Disabled', props: { disabled: true } },
  ],
});
