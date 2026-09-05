# UcSidebarButton

A navigation button designed for use inside a sidebar or side navigation panel. Supports active state and primary/secondary styles.

## Features

- **Active state**: Two-way bindable `active` model highlights the current page
- **Style variants**: `primary` and `secondary`
- **Icon projection**: Accepts any icon element or component via `<ng-content>`
- **Click output**: Emits `clicked` without browser default navigation

## Usage

```typescript
import { UcSidebarButton } from '@enumsoftware/universal-components';

@Component({
  imports: [UcSidebarButton],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```html
<uc-sidebar-button text="Dashboard" [active]="true" (clicked)="navigate('/dashboard')">
  <uc-phosphor-icon icon="house" weight="bold" />
</uc-sidebar-button>
```

### Secondary style

```html
<uc-sidebar-button text="Settings" [active]="false" style="secondary" (clicked)="navigate('/settings')">
  <uc-phosphor-icon icon="gear" weight="bold" />
</uc-sidebar-button>
```

## API

### Inputs / Models

| Name     | Type                    | Default       | Description                                           |
|----------|-------------------------|---------------|-------------------------------------------------------|
| `text`   | `string` (model, required) | Required   | Button label text (two-way bindable)                  |
| `active` | `boolean` (model, required)| Required   | Highlighted state (two-way bindable)                  |
| `style`  | `SidebarButtonStyle`    | `'primary'`   | Visual style: `'primary'` or `'secondary'`            |

### Outputs

| Name      | Type   | Description                         |
|-----------|--------|-------------------------------------|
| `clicked` | `void` | Emitted when the button is clicked  |

### Content projection

Project any icon element or component as a child to render it alongside the label.
