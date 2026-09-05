# UcFlag

Renders a country flag icon using the `flag-icons` CSS library (included via `themes/theme.css`).

## Features

- **ISO 3166-1 alpha-2 codes**: Pass any two-letter country code
- **Graceful fallback**: Renders a placeholder flag (`xx`) for `null` codes
- **Size control**: Any CSS length accepted by the `size` input
- **Circular clip**: Optional rounded shape via `circular`

## Usage

```typescript
import { UcFlag } from '@enumsoftware/universal-components';

@Component({
  imports: [UcFlag],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-flag countryCode="us" />
```

### Circular, custom size

```html
<uc-flag countryCode="gb" size="2rem" [circular]="true" />
```

### Null-safe (renders placeholder)

```html
<uc-flag [countryCode]="user.countryCode" />
```

## API

### Inputs

| Input         | Type               | Default  | Description                                     |
|---------------|--------------------|----------|-------------------------------------------------|
| `countryCode` | `string \| null`   | Required | ISO 3166-1 alpha-2 country code, or `null`      |
| `size`        | `string`           | `'1em'`  | CSS size of the flag icon                       |
| `circular`    | `boolean`          | `false`  | Clips the flag into a circle                    |

## Prerequisites

Import `themes/theme.css` (or `flag-icons` directly) in your application stylesheet so the `flag-icons` CSS classes are available.
