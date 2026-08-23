# UcIconButton

An icon-only button component built on Phosphor icons, with optional toggle (pressed) state.

## Features

- **Variants**: `primary`, `secondary`, `error`
- **Toggle mode**: Set `pressed` to a boolean to make the button a two-state toggle with `aria-pressed`
- **Inverse colour**: Optional `inverseColor` for use on dark backgrounds
- **Disabled state**: Prevents interaction and click emission
- **Accessible**: Requires `label` for screen-reader text; wires up `aria-pressed` for toggles

## Usage

```typescript
import { UcIconButton } from '@enumsoftware/universal-components';

@Component({
  imports: [UcIconButton],
  template: `...`,
})
export class MyComponent {}
```

### Action button

```html
<uc-icon-button phosphorIcon="trash" label="Delete item" (clicked)="onDelete()" />
```

### Toggle button

```html
<uc-icon-button
  phosphorIcon="star"
  label="Favourite"
  [(pressed)]="isFavourite"
/>
```

### Disabled

```html
<uc-icon-button phosphorIcon="pencil" label="Edit" [disabled]="true" />
```

## API

### Inputs / Models

| Name             | Type                    | Default       | Description                                                   |
|------------------|-------------------------|---------------|---------------------------------------------------------------|
| `phosphorIcon`   | `string`                | `''`          | Phosphor icon name (e.g. `'trash'`, `'arrow-right'`)          |
| `phosphorWeight` | `string`                | `'bold'`      | Phosphor icon weight (e.g. `'regular'`, `'fill'`)             |
| `label`          | `string`                | `''`          | Accessible label (used as `aria-label`)                       |
| `variant`        | `IconButtonVariant`     | `'primary'`   | Visual style: `primary`, `secondary`, or `error`              |
| `disabled`       | `boolean`               | `false`       | Disables the button                                           |
| `inverseColor`   | `boolean`               | `false`       | Uses inverse colour palette for dark backgrounds              |
| `pressed`        | `boolean \| null` (model)| `null`       | Toggle state; `null` = plain action, `boolean` = toggle       |

`IconButtonVariant` is `'primary' | 'secondary' | 'error'`.

### Outputs

| Name      | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `clicked` | `void` | Emitted on a non-disabled click      |

## Accessibility

- `label` maps to `aria-label` on the button element.
- When `pressed` is a boolean, `aria-pressed` is applied automatically.
- Disabled buttons remain focusable for assistive technology.
