# UcColorWheel

An interactive circular hue wheel canvas. Used internally by `UcColorPicker`.

## Features

- **Canvas-based hue picker**: Drag around the ring to change the hue
- **Configurable size**: Diameter via the `size` input
- **Disabled and read-only modes**
- **Two-way color binding**: `value` is a model signal (hex string)
- **`colorChange` output**: Emits the new hex colour on every pointer move

## Usage

> In most cases you should use `UcColorPicker` rather than `UcColorWheel` directly.

```typescript
import { UcColorWheel } from '@enumsoftware/universal-components/uc-color-picker/uc-color-wheel/uc-color-wheel';

@Component({
  imports: [UcColorWheel],
  template: `...`,
})
export class MyComponent {}
```

```html
<uc-color-wheel [(value)]="hexColor" (colorChange)="onColor($event)" />
```

## API

### Inputs / Models

| Name       | Type      | Default      | Description                                      |
|------------|-----------|--------------|--------------------------------------------------|
| `size`     | `number`  | `220`        | Canvas diameter in pixels                        |
| `disabled` | `boolean` | `false`      | Disables pointer interaction                     |
| `readonly` | `boolean` | `false`      | Makes the canvas read-only                       |
| `value`    | `string` (model) | `'#ff0000'` | Current colour as a hex string        |

### Outputs

| Name          | Type     | Description                                 |
|---------------|----------|---------------------------------------------|
| `colorChange` | `string` | Emits the new hex colour on every change    |
