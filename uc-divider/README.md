# UcDivider

A thin rule that visually separates sections of content. Supports horizontal and vertical orientations, optional label text, and an inverse colour variant.

## Features

- **Orientation**: Horizontal (default) or vertical via `vertical` input
- **Label text**: Optional centred text rendered inside the rule
- **Variants**: `default` and `inverse`
- **Themeable**: Styled with `--uc-*` CSS custom properties

## Usage

```typescript
import { UcDivider } from '@enumsoftware/universal-components';

@Component({
  imports: [UcDivider],
  template: `...`,
})
export class MyComponent {}
```

### Basic horizontal divider

```html
<uc-divider />
```

### With label

```html
<uc-divider text="or" />
```

### Vertical

```html
<div style="display:flex; height: 3rem;">
  <span>Left</span>
  <uc-divider [vertical]="true" />
  <span>Right</span>
</div>
```

### Inverse variant

```html
<uc-divider variant="inverse" />
```

## API

### Inputs

| Input      | Type                      | Default     | Description                                 |
|------------|---------------------------|-------------|---------------------------------------------|
| `variant`  | `'default' \| 'inverse'`  | `'default'` | Colour variant                              |
| `vertical` | `boolean`                 | `false`     | Renders a vertical rule when `true`         |
| `text`     | `string`                  | `undefined` | Optional label text centred in the divider  |
