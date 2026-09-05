# UcSpinnerLoading

A circular spinner loading indicator.

## Features

- **Conditional display**: Shown when `loading` is truthy, hidden otherwise
- **Custom colour**: Override the spinner colour with the `color` model
- **Custom size**: Set the spinner diameter via the `size` model
- **Custom thickness**: Control stroke thickness via the `thickness` model

## Usage

```typescript
import { UcSpinnerLoading } from '@enumsoftware/universal-components';

@Component({
  imports: [UcSpinnerLoading],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-spinner-loading [loading]="isLoading()" />
```

### Custom colour and size

```html
<uc-spinner-loading [loading]="isLoading()" color="#6366f1" size="3rem" thickness="4px" />
```

## API

### Models

| Name        | Type                   | Description                                       |
|-------------|------------------------|---------------------------------------------------|
| `loading`   | `any` (model, required)| Shows the spinner when truthy                     |
| `color`     | `string \| undefined`  | CSS colour string for the spinner                 |
| `size`      | `string \| undefined`  | CSS size (diameter) of the spinner                |
| `thickness` | `string \| undefined`  | CSS stroke thickness of the spinner               |
