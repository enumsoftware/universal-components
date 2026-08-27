import { defineShowcase, number, select, text } from '../workbench/core';
import { UcCalendar } from './uc-calendar';

export default defineShowcase({
  id: 'components/calendar',
  group: 'Components',
  title: 'Calendar',
  component: UcCalendar,
  knobs: {
    viewYear: number(2026),
    viewMonth: number(7, { min: 0, max: 11, description: '0-indexed month (0 = January, 11 = December)' }),
    selectedDate: text('', { description: 'Selected date as YYYY-MM-DD (single mode only)' }),
    mode: select(['single', 'range'] as const, 'single'),
    rangeStart: text(''),
    rangeEnd: text(''),
    rangeStep: select(['start', 'end'] as const, 'start'),
  },
  examples: [
    { name: 'With Selected Date', description: 'A single date pre-selected.', props: { selectedDate: '2026-08-13' } },
    {
      name: 'Range Complete',
      description: 'Range mode with both start and end dates set.',
      props: { mode: 'range', rangeStart: '2026-08-05', rangeEnd: '2026-08-18', rangeStep: 'start' },
    },
    {
      name: 'Range Picking End',
      description: 'Range mode after picking the start date - waiting for the user to pick the end.',
      props: { mode: 'range', rangeStart: '2026-08-10', rangeEnd: '', rangeStep: 'end' },
    },
    {
      name: 'Mid Week Start',
      description: 'A month whose first day falls mid-week, showing padding days from the previous month.',
      props: { viewYear: 2026, viewMonth: 9, selectedDate: '2026-10-01' },
    },
  ],
});
