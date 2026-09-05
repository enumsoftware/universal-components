# UcSlider

A range slider component that implements Angular Signal Forms' `FormValueControl<number>` interface.

## Features

- **Signal Forms integration**: Implements `FormValueControl<number>`
- **Configurable range**: `min`, `max`, and `step` inputs
- **Value display**: Optional current-value readout via `showValue`
- **Validation**: Displays errors and invalid/touched state
- **Disabled and read-only modes**

## Usage

```typescript
import { UcSlider } from '@enumsoftware/universal-components';

@Component({
  imports: [UcSlider],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-slider id="volume" label="Volume" [(value)]="volume" />
```

### Custom range and step

```html
<uc-slider id="rating" label="Rating" [min]="1" [max]="10" [step]="1" [(value)]="rating" />
```

### Hide value readout

```html
<uc-slider id="opacity" label="Opacity" [showValue]="false" [(value)]="opacity" />
```

## API

### Inputs / Models

| Name              | Type                  | Default     | Description                                              |
|-------------------|-----------------------|-------------|----------------------------------------------------------|
| `id`              | `string`              | Required    | Unique id for the `<input type="range">` element         |
| `label`           | `string`              | `''`        | Visible label text                                       |
| `disabled`        | `boolean`             | `false`     | Disables the slider                                      |
| `readonly`        | `boolean`             | `false`     | Makes the slider read-only                               |
| `hidden`          | `boolean`             | `false`     | Hides the slider                                         |
| `invalid`         | `boolean`             | `false`     | Marks the slider as invalid                              |
| `errors`          | `ValidationError[]`   | `[]`        | Validation errors to display                             |
| `disabledReasons` | `DisabledReason[]`    | `[]`        | Reasons why the slider is disabled                       |
| `min`             | `number \| undefined` | `0`         | Minimum value                                            |
| `max`             | `number \| undefined` | `100`       | Maximum value                                            |
| `step`            | `number \| undefined` | `1`         | Step increment                                           |
| `showValue`       | `boolean`             | `true`      | Shows the current numeric value next to the slider       |
| `value`           | `number` (model)      | `0`         | Current value (two-way bindable)                         |
| `touched`         | `boolean` (model)     | `false`     | Whether the user has interacted with the slider          |
