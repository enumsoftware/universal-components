# UcCard

A simple container component that wraps content in a styled card surface.

## Features

- **Fit modes**: `fit` (shrink-to-content) and `fill` (expand to fill available space)
- **Content projection**: Accepts any content via `<ng-content>`
- **Themeable**: Styled with `--uc-*` CSS custom properties

## Usage

```typescript
import { UcCard } from '@enumsoftware/universal-components';

@Component({
  imports: [UcCard],
  template: `...`,
})
export class MyComponent {}
```

### Basic card

```html
<uc-card>
  <p>Hello from inside the card.</p>
</uc-card>
```

### Fill mode (stretch to parent)

```html
<uc-card fit="fill">
  <p>This card fills its container.</p>
</uc-card>
```

## API

### Inputs

| Input | Type       | Default | Description                                |
|-------|------------|---------|--------------------------------------------|
| `fit` | `CardFit`  | `'fit'` | Layout mode: `'fit'` or `'fill'`           |

`CardFit` is `'fit' | 'fill'`.
