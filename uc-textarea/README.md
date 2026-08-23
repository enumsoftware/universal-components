# UcTextarea

A multi-line text input that implements Angular Signal Forms' `FormValueControl<string | null>` interface.

## Features

- **Signal Forms integration**: Implements `FormValueControl<string | null>`
- **Configurable rows**: Control the visible height with the `rows` input
- **Validation display**: Shows error messages and invalid/touched state
- **Hidden label**: Visually hides label while keeping it for accessibility
- **Disabled, readonly, and hidden modes**

## Usage

```typescript
import { UcTextarea } from '@enumsoftware/universal-components';

@Component({
  imports: [UcTextarea],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-textarea id="bio" label="Bio" [(value)]="bio" />
```

### Custom rows

```html
<uc-textarea id="notes" label="Notes" [rows]="10" [(value)]="notes" />
```

### Hidden label (accessible)

```html
<uc-textarea id="desc" label="Description" [hideLabel]="true" [(value)]="desc" />
```

## API

### Inputs / Models

| Name              | Type                        | Default   | Description                                              |
|-------------------|-----------------------------|-----------|----------------------------------------------------------|
| `id`              | `string`                    | Required  | Unique id for the `<textarea>` element                   |
| `label`           | `string`                    | `''`      | Visible label text                                       |
| `hideLabel`       | `boolean`                   | `false`   | Hides label visually; uses it as `aria-label`            |
| `placeholder`     | `string`                    | `''`      | Placeholder text                                         |
| `rows`            | `number`                    | `5`       | Number of visible text rows                              |
| `autocomplete`    | `string`                    | `'off'`   | Native `autocomplete` attribute                          |
| `controlAriaLabel`| `string \| null`            | `null`    | Overrides the accessible label when set                  |
| `disabled`        | `boolean`                   | `false`   | Disables the textarea                                    |
| `disabledReasons` | `DisabledReason[]`          | `[]`      | Reasons why the textarea is disabled                     |
| `readonly`        | `boolean`                   | `false`   | Makes the textarea read-only                             |
| `hidden`          | `boolean`                   | `false`   | Hides the textarea                                       |
| `invalid`         | `boolean`                   | `false`   | Marks the textarea as invalid                            |
| `errors`          | `ValidationError[]`         | `[]`      | Validation errors to display                             |
| `value`           | `string \| null` (model)    | `null`    | Current value (two-way bindable)                         |
| `touched`         | `boolean` (model)           | `false`   | Whether the user has interacted                          |
