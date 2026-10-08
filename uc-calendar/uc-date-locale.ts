import { InjectionToken, LOCALE_ID, Provider, inject } from '@angular/core';
import { Temporal } from './uc-calendar-date';

/** Texts the date picker shows or reads out. */
export interface UcDateLabels {
  placeholder: string;
  rangeStart: string;
  rangeEnd: string;
  dialog: string;
  today: string;
  cancel: string;
  save: string;
  hours: string;
  minutes: string;
  previous: string;
  next: string;
  /** Name of the uc-weekday-picker group when it shows no label of its own. */
  weekdays: string;
}

/** App-wide defaults for the calendar and date picker; a component's own inputs still win. */
export interface UcDateLocaleConfig {
  /** BCP 47 locale, e.g. `hr-HR`. Defaults to Angular's `LOCALE_ID`. */
  locale?: string;
  /** 1 = Monday ... 7 = Sunday. Defaults to the locale's own first day of the week. */
  firstDayOfWeek?: number;
  /** Overrides for the built-in texts of the locale's language. */
  labels?: Partial<UcDateLabels>;
}

export const UC_DATE_LOCALE = new InjectionToken<UcDateLocaleConfig>('UC_DATE_LOCALE');

/**
 * Sets the calendar and date picker locale for the whole app (or a lazy route):
 *
 * ```ts
 * providers: [provideUcDateLocale({ locale: 'hr-HR' })]
 * ```
 *
 * Without it the components follow Angular's `LOCALE_ID`.
 */
export function provideUcDateLocale(config: UcDateLocaleConfig): Provider {
  return { provide: UC_DATE_LOCALE, useValue: config };
}

const EN_LABELS: UcDateLabels = {
  placeholder: 'Select date',
  rangeStart: 'Select start date',
  rangeEnd: 'Select end date',
  dialog: 'Date picker',
  today: 'Today',
  cancel: 'Cancel',
  save: 'Save',
  hours: 'Hours',
  minutes: 'Minutes',
  previous: 'Previous',
  next: 'Next',
  weekdays: 'Days of the week',
};

/** Built-in texts by language subtag; any other language falls back to English. */
const BUILT_IN_LABELS: Record<string, UcDateLabels> = {
  en: EN_LABELS,
  hr: {
    placeholder: 'Odaberite datum',
    rangeStart: 'Odaberite početni datum',
    rangeEnd: 'Odaberite završni datum',
    dialog: 'Odabir datuma',
    today: 'Danas',
    cancel: 'Odustani',
    save: 'Spremi',
    hours: 'Sati',
    minutes: 'Minute',
    previous: 'Prethodno',
    next: 'Sljedeće',
    weekdays: 'Dani u tjednu',
  },
};

export function builtInDateLabels(locale: string): UcDateLabels {
  const language = locale.split(/[-_]/)[0].toLowerCase();
  return BUILT_IN_LABELS[language] ?? EN_LABELS;
}

/** The app-wide config plus Angular's `LOCALE_ID`; call in an injection context. */
export function injectDateLocaleDefaults(): { locale: string; config: UcDateLocaleConfig } {
  const config = inject(UC_DATE_LOCALE, { optional: true }) ?? {};
  const locale = config.locale ?? inject(LOCALE_ID, { optional: true }) ?? 'en-US';
  return { locale, config };
}

/** 1 = Monday ... 7 = Sunday; `Intl.Locale` week info where the runtime has it, else Monday outside the Americas. */
export function localeFirstDayOfWeek(locale: string): number {
  try {
    const intlLocale = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const weekInfo = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    if (weekInfo?.firstDay) return weekInfo.firstDay;
    const region = intlLocale.maximize().region;
    return region && ['US', 'CA', 'MX', 'BR', 'JP', 'IL'].includes(region) ? 7 : 1;
  } catch {
    return 1;
  }
}

/** Formats a civil date in UTC, so no time zone can move it to a neighbouring day. */
export function formatPlainDate(date: Temporal.PlainDate, locale: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(toUtcDate(date));
}

export function formatPlainTime(hour: number, minute: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
    .format(new Date(Date.UTC(2000, 0, 1, hour, minute)));
}

/** Month names in the locale, January first, capitalised for headings. */
export function localeMonthNames(locale: string, width: 'long' | 'short'): string[] {
  const format = new Intl.DateTimeFormat(locale, { month: width, timeZone: 'UTC' });
  return Array.from({ length: 12 }, (_, i) => capitalise(format.format(new Date(Date.UTC(2026, i, 1))), locale));
}

/** Weekday names in the locale, starting with `firstDayOfWeek` (1 = Monday), capitalised for headings. */
export function localeWeekdayNames(locale: string, firstDayOfWeek: number, width: 'short' | 'long' = 'short'): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: width, timeZone: 'UTC' });
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) => {
    const dayOfWeek = ((firstDayOfWeek - 1 + i) % 7) + 1;
    return capitalise(format.format(new Date(Date.UTC(2024, 0, dayOfWeek))), locale);
  });
}

/** Spoken label for a day button, e.g. `Wednesday, August 13, 2026` or `srijeda, 13. kolovoza 2026.` */
export function localeDayLabel(date: Temporal.PlainDate, locale: string): string {
  return formatPlainDate(date, locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function toUtcDate(date: Temporal.PlainDate): Date {
  return new Date(Date.UTC(date.year, date.month - 1, date.day));
}

function capitalise(text: string, locale: string): string {
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}
