# UcWeekdayPicker

Picks the days of the week something applies on, such as a timetable that runs Monday to Friday.
Each day is a toggle button (`aria-pressed`) in a labelled group.

## Usage

```html
<uc-weekday-picker [id]="'days'" [label]="'Runs on'" [(value)]="days" />
```

With signal forms:

```html
<uc-weekday-picker [id]="'days'" [label]="'Runs on'" [formField]="form.days" />
```

`required()` does not count an empty array as missing, so check the length:

```ts
validate(path.days, ({ value }) => (value().length > 0 ? null : requiredError({ message: 'Pick a day' })));
```

## Value

ISO day numbers, `1` = Monday ... `7` = Sunday (as Temporal numbers them), always sorted:
`[1, 2, 3, 4, 5]` is Monday to Friday.

## Inputs

| Input | Default | |
| --- | --- | --- |
| `value` | `[]` | Model of the chosen days. |
| `id` | `uc-weekday-picker` | Prefix for the label, button and error ids. |
| `label` | | Visible name of the group. Without it the group is read out as the locale's "days of the week". |
| `hideLabel` | `false` | Keeps the label for screen readers only. |
| `locale` | `provideUcDateLocale`, then `LOCALE_ID` | Day names. |
| `firstDayOfWeek` | the locale's | First button, `1` = Monday ... `7` = Sunday. |
| `disabled` | `false` | |

`errors`, `invalid` and `touched` come from signal forms; errors show once a day button loses focus.

## Localization

Day names come from `Intl` in the resolved locale: `Mon` / `Monday` in English, `Pon` / `Ponedjeljak` in
Croatian. The group's fallback name is the `weekdays` text of `UcDateLabels`, which
`provideUcDateLocale({ labels: { weekdays: '...' } })` can replace.

## Theming

| Token | Default |
| --- | --- |
| `--uc-weekday-picker-day-size` | `2.75rem` |
| `--uc-weekday-picker-gap` | `0.375rem` |
| `--uc-weekday-picker-day-color` | `--uc-paragraph-text-color` |
| `--uc-weekday-picker-day-background` | `--uc-background-color-90` |
| `--uc-weekday-picker-day-hover-background` | foreground at 12% |
| `--uc-weekday-picker-selected-color` | `--uc-inverse-foreground-color` |
| `--uc-weekday-picker-selected-background` | `--uc-primary-color` |
| `--uc-weekday-picker-label-color` | `--uc-foreground-color` |
