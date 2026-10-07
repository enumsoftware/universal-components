# UcCalendar

A standalone, reusable monthly calendar grid. Used internally by `UcDateTimePicker` but can be used on its own wherever you need a calendar display without the full date-picker chrome.

## Features

- **Single & range selection** — renders selected dates, range spans, and a hover-preview strip
- **Self-selecting in single mode** — `selectedDate` is a `model()`, so clicking a day selects it even with no `(daySelect)` listener attached; a host that owns the value (like `UcDateTimePicker`'s draft state) still wins via its one-way binding
- **Follows its selection** — with no `viewYear`/`viewMonth` pinned, the grid opens on the month of the selected date (or today when nothing is selected)
- **Stable 6-week grid** — always 6 rows so height never jumps between months
- **Accessible** — every day button carries an `aria-label` and `aria-pressed` state
- **Signal-based** — all inputs are Angular input signals (Angular 17+)
- **Themeable** — driven entirely by `--uc-dtp-*` CSS custom properties
- **Temporal-based** — days are `Temporal.PlainDate`, so a picked day is a civil date with no time zone attached and never shifts by one

## Installation

`UcCalendar` is exported from `@enumsoftware/universal-components`.

```typescript
import { UcCalendar, CalendarDay } from '@enumsoftware/universal-components';
```

### Temporal

Dates are modelled with the [Temporal API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal).
The package depends on [`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill)
and imports `Temporal` from it directly, so nothing is required of the host app — no
global is patched, and browsers without native Temporal (notably Safari) work the same
as those with it.

To name the types in your own code, import `Temporal` from the same polyfill:

```typescript
import { Temporal } from 'temporal-polyfill';
```

## Usage

### Display only

`viewYear`/`viewMonth` are optional. With neither pinned, the calendar renders the
month of whatever is selected, so a date set from outside is always visible:

```html
<uc-calendar selectedDate="2026-08-13" />
```

### Single mode

Pin `viewYear`/`viewMonth` when the host owns month navigation (as
`UcDateTimePicker` does):

```typescript
import { Component, signal } from '@angular/core';
import { Temporal } from 'temporal-polyfill';
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
  readonly year = signal(Temporal.Now.plainDateISO().year);
  readonly month = signal(Temporal.Now.plainDateISO().month);
  readonly selected = signal('');

  onDaySelect(day: CalendarDay): void {
    this.selected.set(day.iso);
    // Navigate to the clicked month if the user clicked a padding day
    this.year.set(day.date.year);
    this.month.set(day.date.month);
  }
}
```

### Range mode

```typescript
import { Component, signal } from '@angular/core';
import { Temporal } from 'temporal-polyfill';
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
  readonly year = signal(Temporal.Now.plainDateISO().year);
  readonly month = signal(Temporal.Now.plainDateISO().month);
  readonly rangeStart = signal('');
  readonly rangeEnd = signal('');
  readonly rangeStep = signal<'start' | 'end'>('start');
  readonly hoverDate = signal<Temporal.PlainDate | null>(null);

  onDaySelect(day: CalendarDay): void {
    if (this.rangeStep() === 'start' || (this.rangeStart() && this.rangeEnd())) {
      this.rangeStart.set(day.iso);
      this.rangeEnd.set('');
      this.rangeStep.set('end');
    } else {
      this.rangeEnd.set(day.iso);
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
| `viewYear` | `number \| undefined` | `undefined` | Year to display. Omit to follow the current selection (`selectedDate`, or `rangeStart` in range mode), falling back to today. |
| `viewMonth` | `number \| undefined` | `undefined` | Month to display — 1-indexed (1 = January, 12 = December), matching `Temporal.PlainDate.month`. Omit to follow the current selection, falling back to today. |
| `selectedDate` | `string` (`model()`) | `''` | Selected date in `YYYY-MM-DD` format. Used in single mode. Self-updates on click; bind with `[selectedDate]` to also receive external changes, or `[(selectedDate)]` for two-way. |
| `mode` | `'single' \| 'range'` | `'single'` | Selection mode |
| `rangeStart` | `string` | `''` | Range start date in `YYYY-MM-DD` format |
| `rangeEnd` | `string` | `''` | Range end date in `YYYY-MM-DD` format |
| `rangeStep` | `'start' \| 'end'` | `'start'` | Which range endpoint is being picked; controls the hover-preview direction |
| `hoverDate` | `Temporal.PlainDate \| null` | `null` | Currently hovered date, used to render the range preview strip |
| `locale` | `string \| undefined` | `undefined` | BCP 47 locale for weekday names and day labels. Omit to use `provideUcDateLocale`, then Angular's `LOCALE_ID`. |
| `firstDayOfWeek` | `number \| undefined` | `undefined` | First grid column, 1 = Monday ... 7 = Sunday. Omit to use the locale's own first day of the week. |

### Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `daySelect` | `CalendarDay` | Fired when the user clicks a day button |
| `dayHover` | `CalendarDay` | Fired when the pointer enters a day button |
| `dayLeave` | `void` | Fired when the pointer leaves a day button |

### `CalendarDay`

```typescript
interface CalendarDay {
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
```

## Localization

`uc-calendar` and `uc-date-time-picker` follow Angular's `LOCALE_ID`, so an app that sets it gets month and
weekday names, the first day of the week and the date format of its language with no extra code:

```typescript
providers: [{ provide: LOCALE_ID, useValue: 'hr-HR' }]
```

To set the date locale on its own (or for one lazy route), or to change texts, use `provideUcDateLocale`:

```typescript
import { provideUcDateLocale } from '@enumsoftware/universal-components';

providers: [provideUcDateLocale({ locale: 'hr-HR', firstDayOfWeek: 1, labels: { save: 'Potvrdi' } })]
```

A component's own `locale` / `firstDayOfWeek` inputs win over both. Names and formats come from `Intl`, so any
locale works. The picker's texts (Today, Cancel, Save, placeholders, screen-reader labels) are built in for
English and Croatian; other languages fall back to English and can be supplied through `labels`.

`uc-date-time-picker` also takes:

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `locale` | `string \| undefined` | `undefined` | As on `uc-calendar`; passed down to its calendar. |
| `dateFormat` | `Intl.DateTimeFormatOptions` | `{ day: 'numeric', month: 'short', year: 'numeric' }` | How the chosen date is shown: `Sep 7, 2026`, `7. ruj 2026.` For `07. 09. 2026.` use `{ day: '2-digit', month: '2-digit', year: 'numeric' }`. |
| `labels` | `Partial<UcDateLabels>` | `{}` | Overrides for the built-in texts. |
| `placeholder` | `string \| undefined` | `undefined` | Omit for the locale's "Select date" text. |

The value stays `YYYY-MM-DD` (or `YYYY-MM-DDTHH:mm`) in every locale; only what is shown changes. A time is
shown in the locale's clock (`2:05 PM`, `14:05`).

## Migrating from the `Date` API

Three breaking changes came with the move to Temporal:

| Before | After |
|--------|-------|
| `viewMonth` was 0-indexed (`9` = October) | `viewMonth` is 1-indexed (`10` = October) |
| `CalendarDay.date` was a `Date` | `CalendarDay.date` is a `Temporal.PlainDate`; `CalendarDay.iso` is the `YYYY-MM-DD` string |
| `hoverDate` took a `Date` | `hoverDate` takes a `Temporal.PlainDate` — pass `day.date` straight from `dayHover` |

`viewMonth` is the one to watch: an untouched `9` still renders, it just renders
September instead of October. Every `viewMonth` binding needs `+ 1`.

Formatting a selected day no longer needs a helper — `day.iso` is already the
string the `selectedDate`/`rangeStart`/`rangeEnd` inputs expect.

## Theming

`UcCalendar` reads `--uc-dtp-*` CSS custom properties and resolves them on its own
host element, so it renders correctly standalone — no wrapper setup is required
beyond importing the theme. Override any of the plain (non-`-resolved`) variables
on the calendar or any ancestor to re-theme it:

```css
.my-calendar-wrapper {
  --uc-dtp-weekday-color: #888;
  --uc-dtp-value-color: #111;
  --uc-dtp-day-hover-bg: oklch(from var(--uc-primary-color) l c h / 0.1);
  --uc-dtp-day-today-color: var(--uc-primary-color);
  --uc-dtp-day-today-border: var(--uc-primary-color);
  --uc-dtp-day-state-padding: 0.1rem;
  --uc-dtp-day-selected-bg: var(--uc-primary-color);
  --uc-dtp-day-selected-color: #fff;
  --uc-dtp-day-selected-inset: 3px;
  --uc-dtp-day-other-month-color: #bbb;
  --uc-dtp-trigger-focus-color: var(--uc-primary-color);
  /* range */
  --uc-dtp-range-bg: oklch(from var(--uc-primary-color) l c h / 0.15);
  --uc-dtp-range-row-gap: 2px;
  --uc-dtp-range-endcap-inset: 5%;
  /* range preview */
  --uc-dtp-range-preview-bg: oklch(from var(--uc-primary-color) l c h / 0.08);
  --uc-dtp-range-preview-circle-bg: oklch(from var(--uc-primary-color) l c h / 0.25);
  --uc-dtp-range-preview-outline-color: oklch(from var(--uc-primary-color) l c h / 0.5);
  --uc-dtp-range-preview-row-gap: 2px;
  --uc-dtp-range-preview-endcap-inset: 5%;
}
```
