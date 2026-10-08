import {
  Component,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Temporal, parsePlainDate, todayPlainDate } from './uc-calendar-date';
import { injectDateLocaleDefaults, localeDayLabel, localeFirstDayOfWeek, localeWeekdayNames } from './uc-date-locale';

export type CalendarMode = 'single' | 'range';

export interface CalendarDay {
  date: Temporal.PlainDate;
  /** `YYYY-MM-DD`, ready to hand straight back to `selectedDate`/`rangeStart`/`rangeEnd`. */
  iso: string;
  /** Spoken label for the day button in the calendar's locale, e.g. `Wednesday, August 13, 2026`. */
  label: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isRangePreview: boolean;
  isRangePreviewEnd: boolean;
}

/** Six weeks, so the grid height never jumps between months. */
const GRID_DAYS = 42;

@Component({
  selector: 'uc-calendar',
  templateUrl: './uc-calendar.html',
  styleUrl: './uc-calendar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UcCalendar {
  /** Year to display. Omit to follow the current selection, falling back to today. */
  readonly viewYear = input<number | undefined>(undefined);
  /** Month to display, 1-indexed. Omit to follow the current selection, falling back to today. */
  readonly viewMonth = input<number | undefined>(undefined);
  /**
   * A `model()`, not a plain `input()`, so a day click self-selects even when
   * nothing outside is listening to `daySelect` - as with a bare
   * `<uc-calendar selectedDate="..." />` or the workbench showcase. A host that
   * owns the value (like `UcDateTimePicker`'s draft state) still wins: its
   * one-way binding overwrites this on every change detection pass.
   */
  readonly selectedDate = model<string>('');
  readonly mode = input<CalendarMode>('single');
  readonly rangeStart = input<string>('');
  readonly rangeEnd = input<string>('');
  readonly rangeStep = input<'start' | 'end'>('start');
  readonly hoverDate = input<Temporal.PlainDate | null>(null);
  /** BCP 47 locale for weekday names and day labels. Defaults to provideUcDateLocale, then Angular's LOCALE_ID. */
  readonly locale = input<string | undefined>(undefined);
  /** First column of the grid, 1 = Monday ... 7 = Sunday. Defaults to the locale's first day of the week. */
  readonly firstDayOfWeek = input<number | undefined>(undefined);

  private readonly localeDefaults = injectDateLocaleDefaults();

  readonly resolvedLocale = computed<string>(() => this.locale() ?? this.localeDefaults.locale);
  readonly resolvedFirstDayOfWeek = computed<number>(
    () => this.firstDayOfWeek() ?? this.localeDefaults.config.firstDayOfWeek ?? localeFirstDayOfWeek(this.resolvedLocale()),
  );

  readonly daySelect = output<CalendarDay>();
  readonly dayHover = output<CalendarDay>();
  readonly dayLeave = output<void>();

  /** Column headings in the locale, starting with the first day of the week. */
  readonly weekDays = computed<string[]>(() => localeWeekdayNames(this.resolvedLocale(), this.resolvedFirstDayOfWeek()));

  /**
   * The month the grid actually renders. An uncontrolled calendar follows its
   * own selection, so setting `selectedDate` alone shows the selected day
   * instead of silently landing on a month that has nothing marked in it.
   */
  private readonly anchorDate = computed<Temporal.PlainDate>(() => {
    const selection = this.mode() === 'range' ? this.rangeStart() : this.selectedDate();
    return parsePlainDate(selection) ?? todayPlainDate();
  });

  readonly resolvedYear = computed<number>(() => this.viewYear() ?? this.anchorDate().year);
  readonly resolvedMonth = computed<number>(() => this.viewMonth() ?? this.anchorDate().month);

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const year = this.resolvedYear();
    const month = this.resolvedMonth();
    const today = todayPlainDate();

    const isRange = this.mode() === 'range';
    const selected = isRange ? null : parsePlainDate(this.selectedDate());
    const rangeStart = isRange ? parsePlainDate(this.rangeStart()) : null;
    const rangeEnd = isRange ? parsePlainDate(this.rangeEnd()) : null;

    let previewEnd: Temporal.PlainDate | null = null;
    if (rangeStart && !rangeEnd) {
      const hover = this.hoverDate();
      if (hover && Temporal.PlainDate.compare(hover, rangeStart) >= 0) {
        previewEnd = hover;
      }
    }

    const firstOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
    // Temporal weeks run Mon(1)..Sun(7); rows start on the locale's first day of the week.
    const leadingDays = (firstOfMonth.dayOfWeek - this.resolvedFirstDayOfWeek() + 7) % 7;
    const gridStart = firstOfMonth.subtract({ days: leadingDays });
    const locale = this.resolvedLocale();

    return Array.from({ length: GRID_DAYS }, (_, i) => {
      const date = gridStart.add({ days: i });
      const isCurrentMonth = date.year === year && date.month === month;
      return this.buildDay(date, isCurrentMonth, today, selected, rangeStart, rangeEnd, previewEnd, locale);
    });
  });

  readonly calendarWeeks = computed<CalendarDay[][]>(() => {
    const days = this.calendarDays();
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  selectDay(day: CalendarDay): void {
    if (this.mode() === 'single') {
      this.selectedDate.set(day.iso);
    }
    this.daySelect.emit(day);
  }

  private buildDay(
    date: Temporal.PlainDate,
    isCurrentMonth: boolean,
    today: Temporal.PlainDate,
    selected: Temporal.PlainDate | null,
    rangeStart: Temporal.PlainDate | null,
    rangeEnd: Temporal.PlainDate | null,
    previewEnd: Temporal.PlainDate | null,
    locale: string,
  ): CalendarDay {
    const isAfter = (other: Temporal.PlainDate) => Temporal.PlainDate.compare(date, other) > 0;
    const isBefore = (other: Temporal.PlainDate) => Temporal.PlainDate.compare(date, other) < 0;

    const isRangeStart = rangeStart !== null && date.equals(rangeStart);
    const isRangeEnd = rangeEnd !== null && date.equals(rangeEnd);
    const isInRange =
      rangeStart !== null && rangeEnd !== null && isAfter(rangeStart) && isBefore(rangeEnd);
    const isRangePreviewEnd = previewEnd !== null && date.equals(previewEnd);
    const isRangePreview =
      !isRangePreviewEnd &&
      rangeStart !== null &&
      previewEnd !== null &&
      isAfter(rangeStart) &&
      isBefore(previewEnd);

    return {
      date,
      iso: date.toString(),
      label: localeDayLabel(date, locale),
      dayNumber: date.day,
      isCurrentMonth,
      isToday: date.equals(today),
      isSelected: selected !== null && date.equals(selected),
      isRangeStart,
      isRangeEnd,
      isInRange,
      isRangePreview,
      isRangePreviewEnd,
    };
  }
}
