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

/** Names, formats and labels in the user's language live in `uc-date-locale.ts`. */

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
