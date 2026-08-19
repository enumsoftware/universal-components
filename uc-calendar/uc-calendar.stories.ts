import type { Meta, StoryObj } from '@storybook/angular';
import { UcCalendar } from './uc-calendar';

const meta: Meta<UcCalendar> = {
  title: 'Components/Calendar',
  component: UcCalendar,
  args: {
    viewYear: 2026,
    viewMonth: 7, // August
    selectedDate: '',
    mode: 'single',
    rangeStart: '',
    rangeEnd: '',
    rangeStep: 'start',
    hoverDate: null,
  },
  argTypes: {
    viewMonth: {
      control: { type: 'number', min: 0, max: 11 },
      description: '0-indexed month (0 = January, 11 = December)',
    },
    // Forced to text: the global `date` control matcher (/Date$/i) would turn this
    // into a date picker that writes back a numeric timestamp, which the component's
    // YYYY-MM-DD string input cannot parse.
    selectedDate: {
      control: { type: 'text' },
      description: 'Selected date as YYYY-MM-DD (single mode only)',
    },
    mode: {
      control: { type: 'select' },
      options: ['single', 'range'],
    },
    rangeStep: {
      control: { type: 'select' },
      options: ['start', 'end'],
    },
    hoverDate: { control: false },
  },
};

export default meta;
type Story = StoryObj<UcCalendar>;

/** No date selected — use the controls panel to explore inputs. */
export const Default: Story = {};

/** A single date pre-selected. */
export const WithSelectedDate: Story = {
  args: {
    selectedDate: '2026-08-13',
  },
};

/** Range mode with both start and end dates set. */
export const RangeComplete: Story = {
  args: {
    mode: 'range',
    rangeStart: '2026-08-05',
    rangeEnd: '2026-08-18',
    rangeStep: 'start',
  },
};

/** Range mode after picking the start date — waiting for the user to pick the end. */
export const RangePickingEnd: Story = {
  args: {
    mode: 'range',
    rangeStart: '2026-08-10',
    rangeEnd: '',
    rangeStep: 'end',
  },
};

/** A month where the first day falls mid-week, showing padding days from the previous month. */
export const MidWeekStart: Story = {
  args: {
    viewYear: 2026,
    viewMonth: 9, // October 2026 starts on Thursday
    selectedDate: '2026-10-01',
  },
};
