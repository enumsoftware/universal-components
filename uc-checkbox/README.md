# UcCheckbox

An accessible checkbox component that implements Angular Signal Forms' `FormCheckboxControl` interface.

## Features

- **Signal Forms integration**: Implements `FormCheckboxControl` for use with Angular Signal Forms
- **Two-way bindable**: `checked` is a model signal
- **Label**: Optional label text rendered next to the checkbox
- **Disabled state**: Prevents toggling when `disabled` is `true`
- **Accessible**: Associates label with the control via `id`

## Usage

```typescript
import { UcCheckbox } from '@enumsoftware/universal-components';

@Component({
  imports: [UcCheckbox],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-checkbox id="agree" label="I agree to the terms" [(checked)]="agreed" />
```

### Disabled

```html
<uc-checkbox id="locked" label="Locked option" [disabled]="true" [checked]="true" />
```

## API

### Inputs / Models

| Name       | Type      | Default | Description                                  |
|------------|-----------|---------|----------------------------------------------|
| `id`       | `string`  | Required| Unique id linking the label to the input     |
| `label`    | `string`  | `''`    | Label text displayed next to the checkbox    |
| `disabled` | `boolean` | `false` | Prevents toggling when `true`                |
| `checked`  | `boolean` (model) | `false` | Current checked state (two-way bindable) |

## Accessibility

- The `id` input is used to associate the visible `<label>` with the underlying `<input type="checkbox">`.
- Disabled checkboxes remain focusable for screen readers.
