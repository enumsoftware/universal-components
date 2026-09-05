# UcDateTimePicker

A calendar-driven date and date-range picker with optional time selection. Implements Angular Signal Forms' `FormValueControl<string>` interface.

## Features

- **Single and range modes**: Pick a single date or a start/end range
- **Optional time input**: Adds hour/minute fields when `showTime` is `true`
- **Calendar overlay**: Dropdown calendar panel with month, year, and 12-year grid navigation
- **Signal Forms integration**: Implements `FormValueControl<string>`
- **Validation**: Displays errors and touched/invalid state
- **Accessible**: ARIA-labelled trigger and panel

## Usage

```typescript
import { UcDateTimePicker } from '@enumsoftware/universal-components';

@Component({
  imports: [UcDateTimePicker],
  template: `...`,
})
export class MyComponent {}
```

### Single date

```html
<uc-date-time-picker id="dob" label="Date of birth" [(value)]="dob" />
```

### Date + time

```html
<uc-date-time-picker id="event" label="Event time" [showTime]="true" [(value)]="eventAt" />
```

### Date range

```html
<uc-date-time-picker
  id="period"
  label="Reporting period"
  mode="range"
  [(rangeStart)]="start"
  [(rangeEnd)]="end"
  (rangeChange)="onRange($event)"
/>
```

## API

### Inputs / Models

| Name              | Type                    | Default            | Description                                              |
|-------------------|-------------------------|--------------------|----------------------------------------------------------|
| `id`              | `string`                | Required           | Unique id for the trigger element                        |
| `label`           | `string`                | `''`               | Label text                                               |
| `placeholder`     | `string`                | `'Select date'`    | Placeholder shown when no date is selected               |
| `disabled`        | `boolean`               | `false`            | Disables the picker                                      |
| `readonly`        | `boolean`               | `false`            | Makes the picker read-only                               |
| `hidden`          | `boolean`               | `false`            | Hides the picker                                         |
| `showTime`        | `boolean`               | `false`            | Adds hour/minute inputs                                  |
| `mode`            | `DateTimePickerMode`    | `'single'`         | `'single'` or `'range'`                                  |
| `errors`          | `ValidationError[]`     | `[]`               | Validation errors to display                             |
| `disabledReasons` | `DisabledReason[]`      | `[]`               | Reasons why the picker is disabled                       |
| `invalid`         | `boolean`               | `false`            | Marks the picker as invalid                              |
| `value`           | `string` (model)        | `''`               | ISO date string for single mode                          |
| `touched`         | `boolean` (model)       | `false`            | Whether the user has interacted                          |
| `rangeStart`      | `string` (model)        | `''`               | ISO date string for range start                          |
| `rangeEnd`        | `string` (model)        | `''`               | ISO date string for range end                            |

### Outputs

| Name          | Type        | Description                          |
|---------------|-------------|--------------------------------------|
| `dateChange`  | `string`    | Emitted when a single date changes   |
| `rangeChange` | `DateRange` | Emitted when the range changes       |

`DateRange` is `{ start: string; end: string }`.
