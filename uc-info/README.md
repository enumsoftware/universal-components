# UC Info Component

A reusable information box component with three variants (info, warning, error) that respects the application's theming system.

## Features

- Three variants: `info`, `warning`, and `error`
- Content projection for title and body
- Automatic icon selection based on variant, with support for a custom projected icon
- Icon can be hidden entirely via an input
- Theme-aware colors using CSS custom properties
- Support for inline code snippets

## Usage

### Basic Example

```html
<uc-info variant="info">
  <span title>Information Title</span>
  This is the information content.
</uc-info>
```

### With Code Snippets

```html
<uc-info variant="info">
  <span title>API Documentation:</span>
  <code>Base URL: https://your-domain.com/api/public</code><br>
  <code>Include header: X-API-Key: your-api-key</code>
</uc-info>
```

### Warning Variant

```html
<uc-info variant="warning">
  <span title>Warning</span>
  Please proceed with caution.
</uc-info>
```

### Error Variant

```html
<uc-info variant="error">
  <span title>Error</span>
  Something went wrong. Please try again.
</uc-info>
```

### Custom Icon

```html
<uc-info variant="info">
  <i icon class="ph ph-star"></i>
  <span title>Custom Icon</span>
  This info box uses a custom projected icon instead of the default one.
</uc-info>
```

### Hiding the Icon

```html
<uc-info variant="info" [showIcon]="false">
  <span title>No Icon</span>
  This info box has no icon at all.
</uc-info>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'info' \| 'warning' \| 'error'` | `'info'` | The visual style variant of the info box |
| showIcon | `boolean` | `true` | Whether to show the icon (default or custom) |

## Content Projection

The component uses content projection for flexibility:

- Use `<span title>` or any element with the `title` attribute for the title
- Use any element with the `icon` attribute (e.g. `<i icon class="...">`) to replace the default variant icon with a custom one
- Default content (without attributes) becomes the body content

## Styling

The component uses CSS custom properties from `styles.scss` to respect the application's theming:

- **Info variant**: Uses `--uc-primary-color`
- **Warning variant**: Uses orange/yellow colors that adapt to light/dark theme
- **Error variant**: Uses `--uc-error-color`

All colors are automatically adjusted for backgrounds, borders, and text to ensure readability in both light and dark themes.
