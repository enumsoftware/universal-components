import { Temporal } from 'temporal-polyfill';

export { Temporal };

/**
 * Calendar components speak `YYYY-MM-DD` (and `YYYY-MM-DDTHH:mm`) on the wire and
 * `Temporal.PlainDate` internally. Nothing here ever touches a timestamp or a time
 * zone: a picked day is a civil date, so it round-trips unchanged regardless of
 * where the user is.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

/** Weekday names indexed by `Temporal.PlainDate.dayOfWeek` (1 = Monday). */
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Month names indexed by `Temporal.PlainDate.month` (1 = January). */
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Today in the viewer's own time zone, as a civil date. */
export function todayPlainDate(): Temporal.PlainDate {
  return Temporal.Now.plainDateISO();
}

/**
 * `null` for anything that is not a `YYYY-MM-DD` date, so a half-typed value never
 * renders as a bogus day. Out-of-range dates (`2026-13-45`) are rejected rather than
 * rolled over into the next month.
 */
export function parsePlainDate(str: string): Temporal.PlainDate | null {
  if (!ISO_DATE.test(str)) return null;
  try {
    return Temporal.PlainDate.from(str);
  } catch {
    return null;
  }
}

/** Accepts both `YYYY-MM-DD` and `YYYY-MM-DDTHH:mm`; a bare date starts at midnight. */
export function parsePlainDateTime(str: string): Temporal.PlainDateTime | null {
  if (ISO_DATE.test(str)) {
    return parsePlainDate(str)?.toPlainDateTime({ hour: 0, minute: 0 }) ?? null;
  }
  if (!ISO_DATE_TIME.test(str)) return null;
  try {
    return Temporal.PlainDateTime.from(str);
  } catch {
    return null;
  }
}

/** `Wed Aug 13 2026` - a spoken-language label for a day button's `aria-label`. */
export function toDateLabel(date: Temporal.PlainDate): string {
  const weekday = WEEKDAY_LABELS[date.dayOfWeek - 1];
  const month = MONTH_NAMES[date.month - 1].slice(0, 3);
  return `${weekday} ${month} ${date.day} ${date.year}`;
}
