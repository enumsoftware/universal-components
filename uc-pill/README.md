# UcPill

A compact label chip that supports variants, sizes, optional click interaction, and an optional hyperlink.

## Features

- **Variants**: `default`, `info`, `valid`, `error`
- **Sizes**: `default`, `compact`
- **Clickable**: Emits `clicked` when a consumer binds `(clicked)`; the pill only renders as interactive when a listener is present
- **Link support**: Renders as an `<a>` tag when `href` is provided
- **Two-way text binding**: `text` is a model signal

## Usage

```typescript
import { UcPill } from '@enumsoftware/universal-components';

@Component({
  imports: [UcPill],
  template: `...`,
})
export class MyComponent {}
```

### Basic label

```html
<uc-pill text="Active" variant="valid" />
```

### Clickable

```html
<uc-pill text="Remove" variant="error" (clicked)="onRemove()" />
```

### Link pill

```html
<uc-pill text="View details" href="/details/42" />
```

### Compact size

```html
<uc-pill text="Beta" size="compact" variant="info" />
```

## API

### Inputs / Models

| Name      | Type                 | Default     | Description                                                 |
|-----------|----------------------|-------------|-------------------------------------------------------------|
| `text`    | `string \| null` (model) | `null`  | Pill label text (two-way bindable)                          |
| `href`    | `string \| null`     | `null`      | If set, the pill renders as an `<a>` element                |
| `variant` | `PillVariant`        | `'default'` | Colour variant: `default`, `info`, `valid`, or `error`      |
| `size`    | `PillSize`           | `'default'` | Size: `default` or `compact`                                |

### Outputs

| Name      | Type   | Description                                                         |
|-----------|--------|---------------------------------------------------------------------|
| `clicked` | `void` | Emitted on click; pill appears interactive only when this is bound  |
