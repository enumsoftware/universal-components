import {
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Temporal, parsePlainDate, toDateLabel, todayPlainDate } from './uc-calendar-date';

export type CalendarMode = 'single' | 'range';

export interface CalendarDay {
  date: Temporal.PlainDate;
  /** `YYYY-MM-DD`, ready to hand straight back to `selectedDate`/`rangeStart`/`rangeEnd`. */
  iso: string;
  /** Spoken-language label for the day button, e.g. `Wed Aug 13 2026`. */
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
  readonly selectedDate = input<string>('');
  readonly mode = input<CalendarMode>('single');
  readonly rangeStart = input<string>('');
  readonly rangeEnd = input<string>('');
  readonly rangeStep = input<'start' | 'end'>('start');
  readonly hoverDate = input<Temporal.PlainDate | null>(null);

  readonly daySelect = output<CalendarDay>();
  readonly dayHover = output<CalendarDay>();
  readonly dayLeave = output<void>();

  readonly weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
    // Temporal weeks run Mon(1)..Sun(7); this grid starts its rows on Sunday.
    const gridStart = firstOfMonth.subtract({ days: firstOfMonth.dayOfWeek % 7 });

    return Array.from({ length: GRID_DAYS }, (_, i) => {
      const date = gridStart.add({ days: i });
      const isCurrentMonth = date.year === year && date.month === month;
      return this.buildDay(date, isCurrentMonth, today, selected, rangeStart, rangeEnd, previewEnd);
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

  private buildDay(
    date: Temporal.PlainDate,
    isCurrentMonth: boolean,
    today: Temporal.PlainDate,
    selected: Temporal.PlainDate | null,
    rangeStart: Temporal.PlainDate | null,
    rangeEnd: Temporal.PlainDate | null,
    previewEnd: Temporal.PlainDate | null,
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
      label: toDateLabel(date),
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
