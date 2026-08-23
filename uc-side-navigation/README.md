# UcSideNavigation

A responsive side navigation shell with an overlay sidebar for mobile and an inline sidebar for desktop.

## Features

- **Two modes**: `'over'` (overlay drawer) and `'side'` (inline sidebar)
- **Smooth open/close**: Animated overlay with backdrop
- **Backdrop click to close**: Configurable via `closeOnBackdropClick`
- **Scrollable sidebar**: Optional scroll containment via `sidebarScrollable`
- **Content projection**: Header, sidebar, and main content areas via named slots
- **ARIA-managed**: Sidebar open/close state is reflected in ARIA attributes

## Usage

```typescript
import { UcSideNavigation } from '@enumsoftware/universal-components';

@Component({
  imports: [UcSideNavigation],
  template: `...`,
})
export class MyComponent {}
```

### Basic layout

```html
<uc-side-navigation #nav sidebarMode="over">
  <ng-template #sidebar>
    <uc-sidebar-button text="Home" [active]="true" (clicked)="nav.closeSidebar()">
      <uc-phosphor-icon icon="house" />
    </uc-sidebar-button>
  </ng-template>

  <ng-template #content>
    <h1>Main content area</h1>
  </ng-template>
</uc-side-navigation>
```

## API

### Inputs

| Input                  | Type              | Default  | Description                                            |
|------------------------|-------------------|----------|--------------------------------------------------------|
| `sidebarMode`          | `UcSidebarMode`   | `'over'` | `'over'` for drawer overlay, `'side'` for inline panel |
| `sidebarScrollable`    | `boolean`         | `true`   | Enables scroll containment in the sidebar              |
| `closeOnBackdropClick` | `boolean`         | `true`   | Closes the sidebar when the backdrop is clicked        |

`UcSidebarMode` is `'over' | 'side'`.

### Public signals

| Signal          | Type      | Description                           |
|-----------------|-----------|---------------------------------------|
| `isSidebarOpen` | `boolean` | Whether the sidebar is currently open |

### Content slots

Project content via `<ng-template>` references:

| Reference   | Description                      |
|-------------|----------------------------------|
| `#sidebar`  | Sidebar navigation content       |
| `#content`  | Main page content                |
