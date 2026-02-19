# UcColorPicker Component

A reusable color picker component for Angular with a dropdown color wheel interface that integrates with signal forms via `FormValueControl`.

## Features

- **Dropdown Interface**: Click on a color swatch to open a dropdown with the color wheel picker.
- **Color Wheel UI**: Hue + saturation selection via interactive canvas.
- **Angular CDK Overlay**: Uses Angular CDK for dropdown positioning and backdrop handling.
- **Signal Forms Ready**: Implements `FormValueControl` for `FormField` usage.
- **Accessible**: Proper labels, disabled/readonly states, and error messages.
- **Keyboard Navigation**: Supports Enter and Space keys to toggle the dropdown.

## Installation

The component is standalone and can be imported directly. It requires `@angular/cdk` to be installed:

```bash
npm install @angular/cdk
```

```typescript
import { UcColorPicker } from '@app/components/uc-color-picker/uc-color-picker';

@Component({
  imports: [UcColorPicker],
  // ...
})
export class MyComponent {}
```

## Basic Usage

```html
<uc-color-picker id="accent" label="Accent color" [(value)]="accentColor" />
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `...`,
})
export class ExampleComponent {
  accentColor = '#ff0080';
}
```

## User Interaction

1. **Opening the Picker**: Click on the colored swatch or press Enter/Space when focused
2. **Selecting a Color**: Click or drag on the color wheel in the dropdown
3. **Closing the Picker**: Click outside the dropdown or select a color
4. **Keyboard Support**: Tab to focus the swatch, then use Enter or Space to toggle

## With Signal Forms (`FormField`)

```html
<uc-color-picker
  id="brand"
  label="Brand color"
  [formField]="brandForm.color"
/>
```

```typescript
import { Component, signal } from '@angular/core';
The color picker displays a colored rectangle (swatch) showing the current color value. Click on the swatch to open a dropdown containing the color wheel picker.

import { form, FormField, required } from '@angular/forms/signals';

interface BrandModel {
  color: string;
}

@Component({
  selector: 'app-brand-form',
  imports: [FormField],
  template: `...`,
})
export class BrandFormComponent {
  model = signal<BrandModel>({ color: '#1e88e5' });

  brandForm = form(this.model, (schema) => {
    required(schema.color, { message: 'Color is required' });
  });
}
```

## API

### Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Unique identifier for the canvas |
| `label` | `string` | `''` | Label text above the picker |
| `size` | `number` | `200` | Canvas size in pixels (for the color wheel in dropdown) |
| `disabled` | `boolean` | `false` | Disables interaction |
| `readonly` | `boolean` | `false` | Read-only mode |
| `hidden` | `boolean` | `false` | Hides the picker |
| `errors` | `ValidationError[]` | `[]` | Validation errors to display |
| `disabledReasons` | `DisabledReason[]` | `[]` | Reasons why the control is disabled |
| `invalid` | `boolean` | `false` | Whether the control is invalid |

### Models (Two-Way Bindable)

| Model | Type | Description |
| --- | --- | --- |
| `value` | `string` | Selected color (hex, e.g. `#ff0000`) |
| `touched` | `boolean` | Whether the picker has been interacted |

### Outputs

| Output | Type | Description |
| --- | --- | --- |
| `colorChange` | `string` | Emits the selected hex color |

## Styling

The component uses standard CSS variables. You can customize these in your global styles:

```css
:root {
  --foreground-color: #333;
  --primary-color: #0066cc;
  --error-color: #d32f2f;
}
```

## Dependencies

- `@angular/cdk`: For overlay/dropdown functionality
- Angular signals and forms

## Technical Details

- Uses Angular CDK's `CdkConnectedOverlay` for dropdown positioning
- Color wheel rendered using HTML5 Canvas
- Converts between RGB, HSV, and HEX color formats
- Supports pointer events for smooth color selection

## Example in QR Code Generator

```html
<uc-color-picker
  [id]="'qr-foreground-color'"
  label="Foreground color"
  [value]="foregroundColor()"
  (valueChange)="foregroundColor.set($event)"
  (colorChange)="onForegroundColorChange($event)"
/>
```

This component is used in the QR Code Generator to allow users to customize the QR code colors by clicking on a color swatch to open a dropdown with the color wheel picker.
