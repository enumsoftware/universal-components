# UcInput

A text input component that implements Angular Signal Forms' `FormValueControl<string | number | null>` interface. Supports suffix content projection and a built-in password visibility toggle.

## Features

- **Signal Forms integration**: Implements `FormValueControl<string | number | null>`
- **Input types**: `text`, `email`, `password`, `number`, `tel`, `url`, `datetime-local`
- **Password toggle**: Show/hide password button via `togglePassword`
- **Suffix projection**: Project icon buttons or other elements with `[ucInputSuffix]`
- **Validation display**: Shows error messages and invalid/touched state
- **Hidden label**: Visually hides label while keeping it for accessibility

## Usage

```typescript
import { UcInput, UcInputSuffix } from '@enumsoftware/universal-components';

@Component({
  imports: [UcInput, UcInputSuffix],
  template: `...`,
})
export class MyComponent {}
```

### Basic text input

```html
<uc-input id="name" label="Full name" [(value)]="name" />
```

### Password with toggle

```html
<uc-input id="password" label="Password" type="password" [togglePassword]="true" [(value)]="password" />
```

### With suffix icon button

```html
<uc-input id="search" label="Search">
  <uc-icon-button ucInputSuffix phosphorIcon="magnifying-glass" label="Search" />
</uc-input>
```

### Email

```html
<uc-input id="email" label="Email address" type="email" autocomplete="email" [(value)]="email" />
```

## API

### Inputs / Models

| Name              | Type                        | Default    | Description                                                  |
|-------------------|-----------------------------|------------|--------------------------------------------------------------|
| `id`              | `string`                    | Required   | Unique id for the `<input>` element                          |
| `label`           | `string`                    | `''`       | Visible label text                                           |
| `hideLabel`       | `boolean`                   | `false`    | Hides label visually while keeping it for accessibility      |
| `placeholder`     | `string`                    | `''`       | Input placeholder text                                       |
| `type`            | `UcInputType`               | `'text'`   | Input type                                                   |
| `autocomplete`    | `string`                    | `'off'`    | Native `autocomplete` attribute value                        |
| `togglePassword`  | `boolean`                   | `false`    | Shows show/hide toggle for `type="password"` inputs          |
| `disabled`        | `boolean`                   | `false`    | Disables the input                                           |
| `disabledReasons` | `DisabledReason[]`          | `[]`       | Reasons why the input is disabled                            |
| `readonly`        | `boolean`                   | `false`    | Makes the input read-only                                    |
| `hidden`          | `boolean`                   | `false`    | Hides the input                                              |
| `invalid`         | `boolean`                   | `false`    | Marks the input as invalid                                   |
| `errors`          | `ValidationError[]`         | `[]`       | Validation errors to display                                 |
| `value`           | `string \| number \| null` (model) | `null` | Current value (two-way bindable)                        |
| `touched`         | `boolean` (model)           | `false`    | Whether the user has interacted with the input               |

`UcInputType` is `'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'datetime-local'`.

### Content projection

| Selector        | Description                                          |
|-----------------|------------------------------------------------------|
| `[ucInputSuffix]` | Projects elements into the trailing suffix slot    |

## Accessibility

- Label is associated with the input via `for`/`id`.
- When `hideLabel` is `true`, the label text is forwarded to `aria-label`.
- Error messages are announced via `aria-describedby`.
