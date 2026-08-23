# UcPhosphorIcon

Renders a single [Phosphor](https://phosphoricons.com/) icon using the CSS icon font loaded by `themes/theme.css`.

## Features

- **All Phosphor icons**: Any icon available in the Phosphor icon font
- **Weight variants**: `regular`, `thin`, `light`, `bold`, `fill`, `duotone`
- **CSS-based**: No SVG injection; icon is rendered via a `<span>` with generated class names

## Usage

```typescript
import { UcPhosphorIcon } from '@enumsoftware/universal-components';

@Component({
  imports: [UcPhosphorIcon],
  template: `...`,
})
export class MyComponent {}
```

### Default weight (regular)

```html
<uc-phosphor-icon icon="trash" />
```

### Bold weight

```html
<uc-phosphor-icon icon="arrow-right" weight="bold" />
```

### Fill variant

```html
<uc-phosphor-icon icon="star" weight="fill" />
```

## API

### Inputs

| Input    | Type                  | Default      | Description                              |
|----------|-----------------------|--------------|------------------------------------------|
| `icon`   | `string`              | Required     | Phosphor icon name (e.g. `'trash'`)      |
| `weight` | `PhosphorIconWeight`  | `'regular'`  | Icon weight variant                      |

`PhosphorIconWeight` is `'regular' | 'thin' | 'light' | 'bold' | 'fill' | 'duotone'`.

## Prerequisites

`themes/theme.css` (or the Phosphor icon font CSS) must be imported in your application stylesheet for the icon classes to resolve.
