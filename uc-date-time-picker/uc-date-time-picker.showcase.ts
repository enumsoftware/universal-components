import { bool, defineShowcase, select, text } from '../workbench/core';
import { DATE_TIME_PICKER_MODE_OPTIONS, UcDateTimePicker } from './uc-date-time-picker';

export default defineShowcase({
  id: 'components/date-time-picker',
  group: 'Components',
  title: 'Date Time Picker',
  component: UcDateTimePicker,
  knobs: {
    id: text('date-picker-1'),
    label: text('Event date'),
    placeholder: text('Select a date'),
    mode: select(DATE_TIME_PICKER_MODE_OPTIONS, 'single'),
    showTime: bool(false),
    disabled: bool(false),
    readonly: bool(false),
  },
  examples: [
    {
      name: 'With Time',
      props: { showTime: true, label: 'Event date and time', placeholder: 'Select date and time' },
    },
    { name: 'Range Mode', props: { mode: 'range', label: 'Date range', placeholder: 'Select date range' } },
    { name: 'Disabled', props: { disabled: true } },
  ],
});
