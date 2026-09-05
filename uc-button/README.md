# UcButton

A versatile, accessible button component with support for variants, sizes, loading states, and content projection for icons.

## Features

- **Variants**: `primary`, `secondary`, `error`
- **Sizes**: `small`, `medium`, `big`
- **Alignment**: `left`, `center`
- **Loading state**: Shows a spinner with an optional loading label
- **Disabled state**: Prevents interaction and emits no events
- **Type control**: `button`, `submit`, `reset`
- **Signal-based inputs**: Reactive with Angular signals

## Usage

```typescript
import { UcButton } from '@enumsoftware/universal-components';

@Component({
  imports: [UcButton],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-button text="Save" (clicked)="onSave()" />
```

### Variants and sizes

```html
<uc-button text="Delete" variant="error" size="small" />
<uc-button text="Cancel" variant="secondary" size="big" />
```

### Loading state

```html
<uc-button text="Submit" [loading]="isSaving()" loadingText="Saving…" />
```

### Submit button

```html
<uc-button text="Send" type="submit" />
```

## API

### Inputs / Models

| Name          | Type            | Default     | Description                                              |
|---------------|-----------------|-------------|----------------------------------------------------------|
| `text`        | `string` (model)| Required    | Button label (two-way bindable)                          |
| `variant`     | `ButtonVariant` | `'primary'` | Visual style: `primary`, `secondary`, or `error`         |
| `size`        | `ButtonSize`    | `'medium'`  | Size: `small`, `medium`, or `big`                        |
| `align`       | `ButtonAlign`   | `'center'`  | Content alignment: `left` or `center`                    |
| `disabled`    | `boolean`       | `false`     | Disables the button                                      |
| `type`        | `ButtonType`    | `'button'`  | Native button type: `button`, `submit`, or `reset`       |
| `loading`     | `boolean`       | `false`     | Shows the spinner; also prevents click events            |
| `loadingText` | `string`        | `undefined` | Replaces the label while `loading` is `true`             |

### Outputs

| Name      | Type   | Description                  |
|-----------|--------|------------------------------|
| `clicked` | `void` | Emitted on a non-disabled click |

## Accessibility

- Uses a native `<button>` element.
- `disabled` and `loading` both suppress `clicked` events and set `aria-disabled` so the element remains focusable for screen readers.
