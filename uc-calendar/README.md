# UcCalendar

A standalone, reusable monthly calendar grid. Used internally by `UcDateTimePicker` but can be used on its own wherever you need a calendar display without the full date-picker chrome.

## Features

- **Single & range selection** — renders selected dates, range spans, and a hover-preview strip
- **Stable 6-week grid** — always 6 rows so height never jumps between months
- **Accessible** — every day button carries an `aria-label` and `aria-pressed` state
- **Signal-based** — all inputs are Angular input signals (Angular 17+)
- **Themeable** — driven entirely by `--uc-dtp-*` CSS custom properties

## Installation

`UcCalendar` is exported from `@enumsoftware/universal-components`.

```typescript
import { UcCalendar, CalendarDay } from '@enumsoftware/universal-components';
```

## Usage

### Single mode

```typescript
import { Component, signal } from '@angular/core';
import { UcCalendar, CalendarDay } from '@enumsoftware/universal-components';

@Component({
  selector: 'app-example',
  imports: [UcCalendar],
  template: `
    <uc-calendar
      [viewYear]="year()"
      [viewMonth]="month()"
      [selectedDate]="selected()"
      (daySelect)="onDaySelect($event)"
    />
  `,
})
export class ExampleComponent {
  readonly year = signal(new Date().getFullYear());
  readonly month = signal(new Date().getMonth());
  readonly selected = signal('');

  onDaySelect(day: CalendarDay): void {
    const m = String(day.date.getMonth() + 1).padStart(2, '0');
    const d = String(day.date.getDate()).padStart(2, '0');
    this.selected.set(`${day.date.getFullYear()}-${m}-${d}`);
    // Navigate to the clicked month if the user clicked a padding day
    this.year.set(day.date.getFullYear());
    this.month.set(day.date.getMonth());
  }
}
```

### Range mode

```typescript
import { Component, signal } from '@angular/core';
import { UcCalendar, CalendarDay } from '@enumsoftware/universal-components';

@Component({
  selector: 'app-range-example',
  imports: [UcCalendar],
  template: `
    <uc-calendar
      [viewYear]="year()"
      [viewMonth]="month()"
      mode="range"
      [rangeStart]="rangeStart()"
      [rangeEnd]="rangeEnd()"
      [rangeStep]="rangeStep()"
      [hoverDate]="hoverDate()"
      (daySelect)="onDaySelect($event)"
      (dayHover)="onDayHover($event)"
      (dayLeave)="onDayLeave()"
    />
  `,
})
export class RangeExampleComponent {
  readonly year = signal(new Date().getFullYear());
  readonly month = signal(new Date().getMonth());
  readonly rangeStart = signal('');
  readonly rangeEnd = signal('');
  readonly rangeStep = signal<'start' | 'end'>('start');
  readonly hoverDate = signal<Date | null>(null);

  private toDateStr(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  onDaySelect(day: CalendarDay): void {
    const str = this.toDateStr(day.date);
    if (this.rangeStep() === 'start' || (this.rangeStart() && this.rangeEnd())) {
      this.rangeStart.set(str);
      this.rangeEnd.set('');
      this.rangeStep.set('end');
    } else {
      this.rangeEnd.set(str);
      this.rangeStep.set('start');
    }
    this.hoverDate.set(null);
  }

  onDayHover(day: CalendarDay): void {
    if (this.rangeStep() === 'end') this.hoverDate.set(day.date);
  }

  onDayLeave(): void {
    this.hoverDate.set(null);
  }
}
```

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `viewYear` | `number` | **required** | Year to display |
| `viewMonth` | `number` | **required** | Month to display — 0-indexed (0 = January, 11 = December) |
| `selectedDate` | `string` | `''` | Selected date in `YYYY-MM-DD` format. Used in single mode. |
| `mode` | `'single' \| 'range'` | `'single'` | Selection mode |
| `rangeStart` | `string` | `''` | Range start date in `YYYY-MM-DD` format |
| `rangeEnd` | `string` | `''` | Range end date in `YYYY-MM-DD` format |
| `rangeStep` | `'start' \| 'end'` | `'start'` | Which range endpoint is being picked; controls the hover-preview direction |
| `hoverDate` | `Date \| null` | `null` | Currently hovered date, used to render the range preview strip |

### Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `daySelect` | `CalendarDay` | Fired when the user clicks a day button |
| `dayHover` | `CalendarDay` | Fired when the pointer enters a day button |
| `dayLeave` | `void` | Fired when the pointer leaves a day button |

### `CalendarDay`

```typescript
interface CalendarDay {
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
```

## Theming

`UcCalendar` reads `--uc-dtp-*` CSS custom properties and resolves them on its own
host element, so it renders correctly standalone — no wrapper setup is required
beyond importing the theme. Override any of the plain (non-`-resolved`) variables
on the calendar or any ancestor to re-theme it:

```css
.my-calendar-wrapper {
  --uc-dtp-weekday-color: #888;
  --uc-dtp-value-color: #111;
  --uc-dtp-day-hover-bg: oklch(from var(--primary-color) l c h / 0.1);
  --uc-dtp-day-today-color: var(--primary-color);
  --uc-dtp-day-today-border: var(--primary-color);
  --uc-dtp-day-state-padding: 0.1rem;
  --uc-dtp-day-selected-bg: var(--primary-color);
  --uc-dtp-day-selected-color: #fff;
  --uc-dtp-day-selected-inset: 3px;
  --uc-dtp-day-other-month-color: #bbb;
  --uc-dtp-trigger-focus-color: var(--primary-color);
  /* range */
  --uc-dtp-range-bg: oklch(from var(--primary-color) l c h / 0.15);
  --uc-dtp-range-row-gap: 2px;
  --uc-dtp-range-endcap-inset: 5%;
  /* range preview */
  --uc-dtp-range-preview-bg: oklch(from var(--primary-color) l c h / 0.08);
  --uc-dtp-range-preview-circle-bg: oklch(from var(--primary-color) l c h / 0.25);
  --uc-dtp-range-preview-outline-color: oklch(from var(--primary-color) l c h / 0.5);
  --uc-dtp-range-preview-row-gap: 2px;
  --uc-dtp-range-preview-endcap-inset: 5%;
}
```
