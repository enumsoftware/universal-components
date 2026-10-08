import {
  Component,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';
import { UcCalendar, CalendarDay } from '../uc-calendar/uc-calendar';
import {
  Temporal,
  parsePlainDate,
  parsePlainDateTime,
  todayPlainDate,
} from '../uc-calendar/uc-calendar-date';
import {
  UcDateLabels,
  builtInDateLabels,
  formatPlainDate,
  formatPlainTime,
  injectDateLocaleDefaults,
  localeMonthNames,
} from '../uc-calendar/uc-date-locale';

/** Default display format: `Sep 7, 2026` in English, `7. ruj 2026.` in Croatian. */
const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };

export const DATE_TIME_PICKER_MODE_OPTIONS = ['single', 'range'] as const;
export type DateTimePickerMode = (typeof DATE_TIME_PICKER_MODE_OPTIONS)[number];

export type { CalendarDay } from '../uc-calendar/uc-calendar';

export interface DateRange {
  start: string;
  end: string;
}

@Component({
  selector: 'uc-date-time-picker',
  imports: [OverlayModule, UcIconButton, UcCalendar],
  templateUrl: './uc-date-time-picker.html',
  styleUrl: './uc-date-time-picker.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'uc-date-time-picker-host',
  },
})
export class UcDateTimePicker implements FormValueControl<string> {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  /** Shown while empty; defaults to the locale's "Select date" text. */
  readonly placeholder = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly showTime = input<boolean>(false);
  readonly mode = input<DateTimePickerMode>('single');
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly invalid = input<boolean>(false);
  /** BCP 47 locale for names, formats and texts. Defaults to provideUcDateLocale, then Angular's LOCALE_ID. */
  readonly locale = input<string | undefined>(undefined);
  /** How the chosen date is shown, as Intl.DateTimeFormat options, e.g. { day: '2-digit', month: '2-digit', year: 'numeric' }. */
  readonly dateFormat = input<Intl.DateTimeFormatOptions>(DEFAULT_DATE_FORMAT);
  /** Overrides for the built-in texts (Today, Cancel, Save, ...). */
  readonly labels = input<Partial<UcDateLabels>>({});

  private readonly localeDefaults = injectDateLocaleDefaults();

  readonly resolvedLocale = computed<string>(() => this.locale() ?? this.localeDefaults.locale);

  /** Built-in texts of the locale's language, then the app-wide overrides, then this picker's own. */
  readonly texts = computed<UcDateLabels>(() => ({
    ...builtInDateLabels(this.resolvedLocale()),
    ...this.localeDefaults.config.labels,
    ...this.labels(),
  }));

  readonly resolvedPlaceholder = computed<string>(() => this.placeholder() ?? this.texts().placeholder);

  value = model<string>('');
  touched = model<boolean>(false);
  rangeStart = model<string>('');
  rangeEnd = model<string>('');

  dateChange = output<string>();
  rangeChange = output<DateRange>();

  readonly isOpen = signal<boolean>(false);

  /** Controls which panel is shown inside the dropdown */
  readonly pickerView = signal<'calendar' | 'year' | 'month'>('calendar');

  /** Calendar state - month/year currently displayed. `viewMonth` is 1-indexed. */
  readonly viewYear = signal<number>(todayPlainDate().year);
  readonly viewMonth = signal<number>(todayPlainDate().month);

  /** First year shown in the 12-year year-selection grid */
  readonly yearPageStart = signal<number>(Math.floor(todayPlainDate().year / 12) * 12);

  readonly yearGrid = computed<number[]>(() =>
    Array.from({ length: 12 }, (_, i) => this.yearPageStart() + i),
  );

  /** Draft values used while editing in the open dropdown */
  readonly draftDateStr = signal<string>('');
  readonly draftHours = signal<number>(0);
  readonly draftMinutes = signal<number>(0);

  /** Range mode draft state */
  readonly draftRangeStart = signal<string>('');
  readonly draftRangeEnd = signal<string>('');
  readonly rangeStep = signal<'start' | 'end'>('start');
  readonly hoverDate = signal<Temporal.PlainDate | null>(null);

  readonly showErrorState = computed(() => this.invalid() && this.touched());

  readonly monthNames = computed<string[]>(() => localeMonthNames(this.resolvedLocale(), 'long'));
  readonly shortMonthNames = computed<string[]>(() => localeMonthNames(this.resolvedLocale(), 'short'));

  readonly viewMonthLabel = computed(() => {
    return `${this.monthNames()[this.viewMonth() - 1]} ${this.viewYear()}`;
  });

  readonly displayValue = computed<string>(() => {
    if (this.mode() === 'range') {
      const start = this.isOpen() ? this.draftRangeStart() : this.rangeStart();
      const end = this.isOpen() ? this.draftRangeEnd() : this.rangeEnd();
      if (!start) return '';
      const startDisplay = this.formatDateOnly(start);
      if (!end || end === start) return startDisplay;
      return `${startDisplay} - ${this.formatDateOnly(end)}`;
    }
    const val = this.value();
    if (!val) return '';
    return this.formatForDisplay(val);
  });

  readonly rangeSelectionHint = computed<string>(() => {
    if (this.mode() !== 'range') return '';
    return this.rangeStep() === 'start' ? this.texts().rangeStart : this.texts().rangeEnd;
  });

  readonly isSaveDisabled = computed<boolean>(() => {
    if (this.mode() === 'range') return !this.draftRangeStart();
    return !this.draftDateStr();
  });

  toggleDropdown(): void {
    if (this.disabled() || this.readonly()) return;
    if (this.isOpen()) {
      this.cancelChanges();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    this.pickerView.set('calendar');
    if (this.mode() === 'range') {
      const start = parsePlainDate(this.rangeStart());
      if (start) {
        this.showMonthOf(start);
        this.draftRangeStart.set(this.rangeStart());
        this.draftRangeEnd.set(this.rangeEnd());
      } else {
        this.showMonthOf(todayPlainDate());
        this.draftRangeStart.set('');
        this.draftRangeEnd.set('');
      }
      this.rangeStep.set('start');
      this.hoverDate.set(null);
    } else {
      // An unparseable bound value opens on today rather than on a broken month.
      const parsed = parsePlainDateTime(this.value());
      if (parsed) {
        this.draftDateStr.set(parsed.toPlainDate().toString());
        this.draftHours.set(parsed.hour);
        this.draftMinutes.set(parsed.minute);
        this.showMonthOf(parsed.toPlainDate());
      } else {
        const now = Temporal.Now.plainDateTimeISO();
        this.draftDateStr.set('');
        this.draftHours.set(now.hour);
        this.draftMinutes.set(now.minute);
        this.showMonthOf(now.toPlainDate());
      }
    }
    this.isOpen.set(true);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  cancelChanges(): void {
    this.closeDropdown();
  }

  saveChanges(): void {
    if (this.mode() === 'range') {
      const start = this.draftRangeStart();
      if (!start) return;
      const end = this.draftRangeEnd() || start;
      this.rangeStart.set(start);
      this.rangeEnd.set(end);
      this.touched.set(true);
      this.rangeChange.emit({ start, end });
      this.closeDropdown();
    } else {
      const dateStr = this.draftDateStr();
      if (!dateStr) return;
      let result: string;
      if (this.showTime()) {
        const h = String(this.draftHours()).padStart(2, '0');
        const m = String(this.draftMinutes()).padStart(2, '0');
        result = `${dateStr}T${h}:${m}`;
      } else {
        result = dateStr;
      }
      this.value.set(result);
      this.touched.set(true);
      this.dateChange.emit(result);
      this.closeDropdown();
    }
  }

  selectToday(): void {
    const today = todayPlainDate();
    if (this.mode() === 'range') {
      this.draftRangeStart.set(today.toString());
      this.draftRangeEnd.set('');
      this.rangeStep.set('end');
      this.hoverDate.set(null);
    } else {
      this.draftDateStr.set(today.toString());
    }
    this.showMonthOf(today);
  }

  selectDay(day: CalendarDay): void {
    if (this.mode() === 'range') {
      const start = parsePlainDate(this.draftRangeStart());
      const restart =
        this.rangeStep() === 'start' ||
        (this.draftRangeStart() && this.draftRangeEnd()) ||
        start === null ||
        Temporal.PlainDate.compare(day.date, start) < 0;
      if (restart) {
        this.draftRangeStart.set(day.iso);
        this.draftRangeEnd.set('');
        this.rangeStep.set('end');
        this.hoverDate.set(null);
      } else {
        this.draftRangeEnd.set(day.iso);
        this.rangeStep.set('start');
      }
    } else {
      this.draftDateStr.set(day.iso);
      if (!day.isCurrentMonth) {
        this.showMonthOf(day.date);
      }
    }
  }

  onDayHover(day: CalendarDay): void {
    if (this.mode() === 'range' && this.rangeStep() === 'end') {
      this.hoverDate.set(day.date);
    }
  }

  onDayLeave(): void {
    if (this.mode() === 'range') {
      this.hoverDate.set(null);
    }
  }

  openYearPicker(): void {
    this.yearPageStart.set(Math.floor(this.viewYear() / 12) * 12);
    this.pickerView.set('year');
  }

  selectYear(year: number): void {
    this.viewYear.set(year);
    this.pickerView.set('month');
  }

  selectMonth(month: number): void {
    this.viewMonth.set(month);
    this.pickerView.set('calendar');
  }

  previousYearPage(): void {
    this.yearPageStart.update(s => s - 12);
  }

  nextYearPage(): void {
    this.yearPageStart.update(s => s + 12);
  }

  previousMonth(): void {
    this.shiftMonths(-1);
  }

  nextMonth(): void {
    this.shiftMonths(1);
  }

  onHoursChange(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) {
      this.draftHours.set(Math.min(23, Math.max(0, val)));
    }
  }

  onMinutesChange(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) {
      this.draftMinutes.set(Math.min(59, Math.max(0, val)));
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown();
    }
    if (event.key === 'Escape') {
      this.cancelChanges();
    }
  }

  /** Points the calendar at the month containing `date`. */
  private showMonthOf(date: Temporal.PlainDate): void {
    this.viewYear.set(date.year);
    this.viewMonth.set(date.month);
  }

  private shiftMonths(months: number): void {
    const shifted = Temporal.PlainYearMonth.from({
      year: this.viewYear(),
      month: this.viewMonth(),
    }).add({ months });
    this.viewYear.set(shifted.year);
    this.viewMonth.set(shifted.month);
  }

  private formatDateOnly(dateStr: string): string {
    const date = parsePlainDate(dateStr);
    // An unparseable value shows through as typed instead of as a bogus date.
    return date ? this.formatPlainDate(date) : dateStr;
  }

  private formatForDisplay(val: string): string {
    const dateTime = parsePlainDateTime(val);
    if (!dateTime) return val;
    const datePart = this.formatPlainDate(dateTime.toPlainDate());
    if (!this.showTime() || !val.includes('T')) return datePart;
    return `${datePart} ${formatPlainTime(dateTime.hour, dateTime.minute, this.resolvedLocale())}`;
  }

  private formatPlainDate(date: Temporal.PlainDate): string {
    return formatPlainDate(date, this.resolvedLocale(), this.dateFormat());
  }
}
