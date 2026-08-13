import {
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

export type CalendarMode = 'single' | 'range';

export interface CalendarDay {
  date: Date;
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

@Component({
  selector: 'uc-calendar',
  templateUrl: './uc-calendar.html',
  styleUrl: './uc-calendar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UcCalendar {
  readonly viewYear = input.required<number>();
  readonly viewMonth = input.required<number>();
  readonly selectedDate = input<string>('');
  readonly mode = input<CalendarMode>('single');
  readonly rangeStart = input<string>('');
  readonly rangeEnd = input<string>('');
  readonly rangeStep = input<'start' | 'end'>('start');
  readonly hoverDate = input<Date | null>(null);

  readonly daySelect = output<CalendarDay>();
  readonly dayHover = output<CalendarDay>();
  readonly dayLeave = output<void>();

  readonly weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isRange = this.mode() === 'range';
    const selectedDate =
      !isRange && this.selectedDate() ? this.parseDateStr(this.selectedDate()) : null;
    const rangeStartDate =
      isRange && this.rangeStart() ? this.parseDateStr(this.rangeStart()) : null;
    const rangeEndDate =
      isRange && this.rangeEnd() ? this.parseDateStr(this.rangeEnd()) : null;

    let previewEndDate: Date | null = null;
    if (rangeStartDate && !rangeEndDate) {
      const hover = this.hoverDate();
      if (hover) {
        const h = new Date(hover);
        h.setHours(0, 0, 0, 0);
        if (h >= rangeStartDate) previewEndDate = h;
      }
    }

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];

    const startDow = firstDay.getDay();
    for (let i = startDow - 1; i >= 0; i--) {
      days.push(
        this.buildDay(
          new Date(year, month, -i),
          false,
          today,
          selectedDate,
          rangeStartDate,
          rangeEndDate,
          previewEndDate,
        ),
      );
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(
        this.buildDay(
          new Date(year, month, d),
          true,
          today,
          selectedDate,
          rangeStartDate,
          rangeEndDate,
          previewEndDate,
        ),
      );
    }
    // Keep a stable 6-week calendar matrix so layout does not jump between months.
    for (let d = 1; d <= 42 - days.length; d++) {
      days.push(
        this.buildDay(
          new Date(year, month + 1, d),
          false,
          today,
          selectedDate,
          rangeStartDate,
          rangeEndDate,
          previewEndDate,
        ),
      );
    }
    return days;
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
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    selectedDate: Date | null,
    rangeStartDate: Date | null,
    rangeEndDate: Date | null,
    previewEndDate: Date | null,
  ): CalendarDay {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    const isRangeStart =
      rangeStartDate !== null && dateOnly.getTime() === rangeStartDate.getTime();
    const isRangeEnd =
      rangeEndDate !== null && dateOnly.getTime() === rangeEndDate.getTime();
    const isInRange =
      rangeStartDate !== null && rangeEndDate !== null
        ? dateOnly > rangeStartDate && dateOnly < rangeEndDate
        : false;
    const isRangePreviewEnd =
      previewEndDate !== null && dateOnly.getTime() === previewEndDate.getTime();
    const isRangePreview =
      !isRangePreviewEnd && rangeStartDate !== null && previewEndDate !== null
        ? dateOnly > rangeStartDate && dateOnly < previewEndDate
        : false;

    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: dateOnly.getTime() === today.getTime(),
      isSelected: selectedDate !== null && dateOnly.getTime() === selectedDate.getTime(),
      isRangeStart,
      isRangeEnd,
      isInRange,
      isRangePreview,
      isRangePreviewEnd,
    };
  }

  private parseDateStr(str: string): Date {
    const [y, m, d] = str.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
