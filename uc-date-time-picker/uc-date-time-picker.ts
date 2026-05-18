import {
  Component,
  ViewEncapsulation,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';
import { UcButton } from '../uc-button/uc-button';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'uc-date-time-picker',
  imports: [OverlayModule, UcButton, UcIconButton],
  templateUrl: './uc-date-time-picker.html',
  styleUrl: './uc-date-time-picker.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'uc-date-time-picker-host',
  },
})
export class UcDateTimePicker implements FormValueControl<string> {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly placeholder = input<string>('Select date');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly showTime = input<boolean>(false);
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);
  readonly invalid = input<boolean>(false);

  value = model<string>('');
  touched = model<boolean>(false);
  dateChange = output<string>();

  readonly isOpen = signal<boolean>(false);

  /** Calendar state - month/year currently displayed */
  readonly viewYear = signal<number>(new Date().getFullYear());
  readonly viewMonth = signal<number>(new Date().getMonth());

  /** Draft values edited inside the dropdown before Apply */
  readonly draftDateStr = signal<string>('');
  readonly draftHours = signal<number>(0);
  readonly draftMinutes = signal<number>(0);

  readonly showErrorState = computed(() => this.invalid() && this.touched());

  readonly weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  readonly viewMonthLabel = computed(() => {
    return `${this.monthNames[this.viewMonth()]} ${this.viewYear()}`;
  });

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const draftStr = this.draftDateStr();
    const selectedDate = draftStr ? this.parseDateStr(draftStr) : null;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];

    // Prefix: days from previous month to fill the first week
    const startDow = firstDay.getDay();
    for (let i = startDow - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(this.buildDay(date, false, today, selectedDate));
    }

    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push(this.buildDay(date, true, today, selectedDate));
    }

    // Suffix: fill remaining cells to complete the last row (total must be multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push(this.buildDay(date, false, today, selectedDate));
    }

    return days;
  });

  readonly displayValue = computed(() => {
    const val = this.value();
    if (!val) return '';
    return this.formatForDisplay(val);
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
    const val = this.value();
    if (val) {
      const date = this.parseDateTimeStr(val);
      this.draftDateStr.set(this.toDateStr(date));
      this.draftHours.set(date.getHours());
      this.draftMinutes.set(date.getMinutes());
      this.viewYear.set(date.getFullYear());
      this.viewMonth.set(date.getMonth());
    } else {
      const now = new Date();
      this.draftDateStr.set('');
      this.draftHours.set(now.getHours());
      this.draftMinutes.set(now.getMinutes());
      this.viewYear.set(now.getFullYear());
      this.viewMonth.set(now.getMonth());
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

  selectToday(): void {
    const today = new Date();
    this.draftDateStr.set(this.toDateStr(today));
    this.viewYear.set(today.getFullYear());
    this.viewMonth.set(today.getMonth());
  }

  selectDay(day: CalendarDay): void {
    this.draftDateStr.set(this.toDateStr(day.date));
    if (!day.isCurrentMonth) {
      this.viewYear.set(day.date.getFullYear());
      this.viewMonth.set(day.date.getMonth());
    }
  }

  previousMonth(): void {
    const m = this.viewMonth();
    const y = this.viewYear();
    if (m === 0) {
      this.viewMonth.set(11);
      this.viewYear.set(y - 1);
    } else {
      this.viewMonth.set(m - 1);
    }
  }

  nextMonth(): void {
    const m = this.viewMonth();
    const y = this.viewYear();
    if (m === 11) {
      this.viewMonth.set(0);
      this.viewYear.set(y + 1);
    } else {
      this.viewMonth.set(m + 1);
    }
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

  private buildDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    selectedDate: Date | null,
  ): CalendarDay {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: dateOnly.getTime() === today.getTime(),
      isSelected: selectedDate !== null && dateOnly.getTime() === selectedDate.getTime(),
    };
  }

  private toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private parseDateStr(str: string): Date {
    const [y, m, d] = str.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private parseDateTimeStr(str: string): Date {
    if (str.includes('T')) {
      const [datePart, timePart] = str.split('T');
      const [y, m, d] = datePart.split('-').map(Number);
      const [h, min] = timePart.split(':').map(Number);
      return new Date(y, m - 1, d, h, min);
    }
    return this.parseDateStr(str);
  }

  private formatForDisplay(val: string): string {
    try {
      const date = this.parseDateTimeStr(val);
      const month = this.monthNames[date.getMonth()].slice(0, 3);
      const day = date.getDate();
      const year = date.getFullYear();
      if (this.showTime() && val.includes('T')) {
        let h = date.getHours();
        const min = String(date.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${month} ${day}, ${year} ${h}:${min} ${ampm}`;
      }
      return `${month} ${day}, ${year}`;
    } catch {
      return val;
    }
  }
}
