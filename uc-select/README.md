# UcSelect Component

A fully accessible, reusable dropdown select component for Angular, built following Angular best practices and ARIA accessibility standards.

## Features

- **Full ARIA Support**: Implements proper ARIA roles and attributes for screen readers
- **Keyboard Navigation**:
  - `Enter` or `Space` to open/close dropdown
  - `Arrow Up/Down` to navigate options
  - `Escape` to close dropdown
- **Form Integration**: Implements `FormValueControl` interface for reactive forms
- **Customizable Options**: Support for icons, disabled states, and custom labels
- **Type-Safe**: Fully generic component supporting any option value type
- **Accessible**: Built-in support for labels, error messages, and disabled states
- **Responsive**: Adapts to different screen sizes with proper dropdown positioning

## Installation

The component is standalone and can be imported directly:

```typescript
import { UcSelectComponent } from '@app/components/uc-select/uc-select';

@Component({
  imports: [UcSelectComponent],
  // ...
})
export class MyComponent {}
```

## Basic Usage

### Simple Select

```html
<uc-select
  id="country"
  label="Select Country"
  placeholder="Choose a country..."
  [options]="countries"
  [(value)]="selectedCountry"
/>
```

```typescript
import { Component } from '@angular/core';
import { SelectOption } from '@app/components/uc-select/uc-select';

@Component({
  selector: 'app-example',
  template: `...`,
})
export class ExampleComponent {
  countries: SelectOption<string>[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ];

  selectedCountry: string | null = null;
}
```

### With Icons

```html
<uc-select id="status" label="Select Status" [options]="statusOptions" [(value)]="selectedStatus" />
```

```typescript
statusOptions: SelectOption<string>[] = [
  { value: 'active', label: 'Active', icon: '✓' },
  { value: 'inactive', label: 'Inactive', icon: '✕' },
  { value: 'pending', label: 'Pending', icon: '⏳' },
];
```

### With Disabled Options

```typescript
options: SelectOption<string>[] = [
  { value: 'option1', label: 'Available Option' },
  { value: 'option2', label: 'Disabled Option', disabled: true },
  { value: 'option3', label: 'Another Available Option' },
];
```

## API

### Inputs

| Input             | Type                | Default              | Description                                 |
| ----------------- | ------------------- | -------------------- | ------------------------------------------- |
| `id`              | `string`            | Required             | Unique identifier for the select element    |
| `label`           | `string`            | `''`                 | Label text displayed above the select       |
| `placeholder`     | `string`            | `'Select an option'` | Placeholder text when no option is selected |
| `options`         | `SelectOption<T>[]` | `[]`                 | Array of available options                  |
| `disabled`        | `boolean`           | `false`              | Disables the entire select                  |
| `readonly`        | `boolean`           | `false`              | Makes the select read-only                  |
| `hidden`          | `boolean`           | `false`              | Hides the select                            |
| `errors`          | `ValidationError[]` | `[]`                 | Array of validation errors to display       |
| `disabledReasons` | `DisabledReason[]`  | `[]`                 | Reasons why the select is disabled          |

### Models (Two-Way Bindable)

| Model     | Type        | Description                                 |
| --------- | ----------- | ------------------------------------------- |
| `value`   | `T \| null` | The currently selected value                |
| `touched` | `boolean`   | Whether the select has been interacted with |
| `invalid` | `boolean`   | Whether the select has validation errors    |

### Methods

| Method                 | Parameters        | Description                                          |
| ---------------------- | ----------------- | ---------------------------------------------------- |
| `toggleDropdown()`     | -                 | Toggle the dropdown open/close state                 |
| `openDropdown()`       | -                 | Open the dropdown                                    |
| `closeDropdown()`      | -                 | Close the dropdown                                   |
| `selectOption(option)` | `SelectOption<T>` | Select an option and close the dropdown              |
| `onKeydown(event)`     | `KeyboardEvent`   | Handle keyboard navigation                           |
| `onBlur()`             | -                 | Handle blur event (sets touched and closes dropdown) |

### Computed Properties

| Property           | Type                           | Description                                 |
| ------------------ | ------------------------------ | ------------------------------------------- |
| `selectedOption()` | `SelectOption<T> \| undefined` | The currently selected option object        |
| `selectedLabel()`  | `string`                       | Label of the selected option or placeholder |
| `showErrorState()` | `boolean`                      | Whether error state should be displayed     |
| `isOpen()`         | `Signal<boolean>`              | Whether the dropdown is currently open      |

## Advanced Usage

### With Reactive Forms

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from '@app/components/uc-select/uc-select';

@Component({
  template: `
    <form [formGroup]="form">
      <uc-select
        id="country"
        label="Country"
        [options]="countries"
        [formControl]="form.get('country')"
      />
    </form>
  `,
})
export class FormExampleComponent {
  form: FormGroup;
  countries: SelectOption<string>[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      country: [null, Validators.required],
    });
  }
}
```

### With Typed Values

The component is fully generic and can work with any type:

```typescript
interface User {
  id: number;
  name: string;
}

users: SelectOption<User>[] = [
  { value: { id: 1, name: 'John' }, label: 'John Doe' },
  { value: { id: 2, name: 'Jane' }, label: 'Jane Smith' },
];

selectedUser: User | null = null;
```

## Styling

The component uses CSS custom properties for theming. Customize these in your global styles:

```css
:root {
  --foreground-color: #333;
  --primary-color: #0066cc;
  --error-color: #d32f2f;
  --uc-input-background-color: #fff;
  --uc-input-border-color: #ccc;
  --uc-input-border-radius: 4px;
}
```

## Accessibility

The component follows Angular's ARIA guidance and includes:

- Proper ARIA roles (`combobox`, `listbox`, `option`)
- ARIA attributes for state (`aria-expanded`, `aria-selected`, `aria-disabled`)
- Keyboard navigation support
- Screen reader announcements
- Label association
- Error announcement

## Testing

The component includes comprehensive unit tests. Run tests with:

```bash
npm test
```

## References

- [Angular ARIA Select Pattern](https://angular.dev/guide/aria/select)
- [MDN: Select Pattern](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
