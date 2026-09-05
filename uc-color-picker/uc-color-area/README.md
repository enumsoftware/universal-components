# UcColorArea

An interactive square canvas that lets users pick saturation and brightness for a given hue. Used internally by `UcColorPicker`.

## Features

- **Canvas-based SV picker**: Drag the thumb to change saturation and brightness
- **Hue-driven**: Reacts to changes in the bound `value` hue
- **Configurable size**: Square dimensions via the `size` input
- **Disabled and read-only modes**
- **Two-way color binding**: `value` is a model signal (hex string)
- **`colorChange` output**: Emits the new hex colour on every pointer move

## Usage

> In most cases you should use `UcColorPicker` rather than `UcColorArea` directly.

```typescript
import { UcColorArea } from '@enumsoftware/universal-components/uc-color-picker/uc-color-area/uc-color-area';

@Component({
  imports: [UcColorArea],
  template: `...`,
})
export class MyComponent {}
```

```html
<uc-color-area [(value)]="hexColor" (colorChange)="onColor($event)" />
```

## API

### Inputs / Models

| Name       | Type      | Default      | Description                                      |
|------------|-----------|--------------|--------------------------------------------------|
| `size`     | `number`  | `220`        | Canvas width and height in pixels                |
| `disabled` | `boolean` | `false`      | Disables pointer interaction                     |
| `readonly` | `boolean` | `false`      | Makes the canvas read-only                       |
| `value`    | `string` (model) | `'#ff0000'` | Current colour as a hex string        |

### Outputs

| Name          | Type     | Description                                 |
|---------------|----------|---------------------------------------------|
| `colorChange` | `string` | Emits the new hex colour on every change    |
