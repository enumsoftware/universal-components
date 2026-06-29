import type { Meta, StoryObj } from '@storybook/angular';
import { UcDateTimePicker } from './uc-date-time-picker';

const meta: Meta<UcDateTimePicker> = {
  title: 'Components/Date Time Picker',
  component: UcDateTimePicker,
  args: {
    id: 'date-picker-1',
    label: 'Event date',
    placeholder: 'Select a date',
    mode: 'single',
    showTime: false,
    disabled: false,
    readonly: false,
  },
};

export default meta;
type Story = StoryObj<UcDateTimePicker>;

export const Default: Story = {};

export const WithTime: Story = {
  args: {
    showTime: true,
    label: 'Event date and time',
    placeholder: 'Select date and time',
  },
};

export const RangeMode: Story = {
  args: {
    mode: 'range',
    label: 'Date range',
    placeholder: 'Select date range',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
