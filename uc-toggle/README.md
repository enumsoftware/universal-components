# UcToggle

An on/off toggle switch that implements Angular Signal Forms' `FormCheckboxControl` interface.

## Features

- **Signal Forms integration**: Implements `FormCheckboxControl`
- **Two-way bindable**: `checked` is a model signal
- **Change output**: Emits `valueChange` with the new boolean value
- **Disabled state**: Prevents toggling

## Usage

```typescript
import { UcToggle } from '@enumsoftware/universal-components';

@Component({
  imports: [UcToggle],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-toggle [(checked)]="isEnabled" (valueChange)="onToggle($event)" />
```

### Disabled

```html
<uc-toggle [checked]="true" [disabled]="true" />
```

## API

### Inputs / Models

| Name       | Type      | Default | Description                           |
|------------|-----------|---------|---------------------------------------|
| `disabled` | `boolean` | `false` | Prevents toggling when `true`         |
| `checked`  | `boolean` (model) | `false` | Current on/off state          |

### Outputs

| Name          | Type      | Description                          |
|---------------|-----------|--------------------------------------|
| `valueChange` | `boolean` | Emits the new state after each toggle |
