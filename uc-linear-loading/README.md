# UcLinearLoading

A horizontal linear progress bar (indeterminate loading indicator).

## Features

- **Indeterminate animation**: Animates continuously while `loading` is `true`
- **Custom colour**: Override the bar colour via the `color` model
- **Conditional display**: Hidden when `loading` is `false`

## Usage

```typescript
import { UcLinearLoading } from '@enumsoftware/universal-components';

@Component({
  imports: [UcLinearLoading],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-linear-loading [loading]="isLoading()" />
```

### Custom colour

```html
<uc-linear-loading [loading]="isLoading()" color="#6366f1" />
```

## API

### Models

| Name      | Type                   | Description                                     |
|-----------|------------------------|-------------------------------------------------|
| `loading` | `any` (model, required)| Shows the bar when truthy, hides it when falsy  |
| `color`   | `string \| undefined`  | CSS colour string for the progress bar          |
