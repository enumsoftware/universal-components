# UcAvatar

Displays a user avatar using an image, initials, or a fallback icon.

## Features

- **Image with fallback**: Shows a photo URL; falls back to initials or icon if the image fails to load
- **Initials display**: Renders text initials when no valid image is available
- **Icon fallback**: Shows a Phosphor icon (default `user`) when neither image nor initials are provided
- **Custom size and background**: Configurable size and background colour via inputs
- **Signal-based**: Reactive state using Angular signals

## Usage

```typescript
import { UcAvatar } from '@enumsoftware/universal-components';

@Component({
  imports: [UcAvatar],
  template: `...`,
})
export class MyComponent {}
```

### Image avatar

```html
<uc-avatar imageUrl="https://example.com/photo.jpg" alt="Jane Smith" />
```

### Initials avatar

```html
<uc-avatar initials="JS" backgroundColor="#4f46e5" />
```

### Icon fallback (default)

```html
<uc-avatar size="3rem" />
```

## API

### Inputs

| Input             | Type             | Default    | Description                                        |
|-------------------|------------------|------------|----------------------------------------------------|
| `imageUrl`        | `string \| null` | `null`     | URL of the avatar image                            |
| `initials`        | `string \| null` | `null`     | Two-letter initials shown when no image is present |
| `backgroundColor` | `string \| null` | `null`     | Background colour for the initials/icon circle     |
| `icon`            | `string`         | `'user'`   | Phosphor icon name used as the ultimate fallback   |
| `size`            | `string`         | `'2.5rem'` | CSS size of the avatar circle                      |
| `alt`             | `string`         | `''`       | Alt text for the image element                     |

## Accessibility

- The `alt` input is forwarded to the underlying `<img>` element.
- When only an icon is rendered, the icon element is decorative and the surrounding element provides context.
