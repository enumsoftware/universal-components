import { date, defineShowcase, number, select } from '../workbench/core';
import { UcCalendar } from './uc-calendar';

export default defineShowcase({
  id: 'components/calendar',
  group: 'Components',
  title: 'Calendar',
  component: UcCalendar,
  knobs: {
    // Seeded rather than empty so the playground opens with a visible selection -
    // and so the canvas does not drift month to month with the current date,
    // which the a11y baseline counts element by element.
    selectedDate: date('2026-08-13', {
      description: 'Selected date (single mode). The grid follows it unless a view year/month is pinned below.',
    }),
    mode: select(['single', 'range'] as const, 'single'),
    rangeStart: date(''),
    rangeEnd: date(''),
    rangeStep: select(['start', 'end'] as const, 'start'),
    viewYear: number(undefined, { description: 'Leave empty to follow the selection, then today.' }),
    viewMonth: number(undefined, {
      min: 1,
      max: 12,
      description: '1-indexed month (1 = January, 12 = December). Leave empty to follow the selection.',
    }),
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
      name: 'Pinned View Month',
      description: 'A pinned view year/month wins over the selection, showing padding days from the previous month.',
      props: { viewYear: 2026, viewMonth: 10, selectedDate: '2026-10-01' },
    },
  ],
});
