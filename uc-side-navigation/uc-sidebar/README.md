# UcSidebar

A simple sidebar panel container used inside `UcSideNavigation`. Wraps content in a styled sidebar shell with an open/close model.

## Usage

> Used internally by `UcSideNavigation`. Direct use is only needed for fully custom layouts.

```typescript
import { UcSidebar } from '@enumsoftware/universal-components/uc-side-navigation/uc-sidebar/uc-sidebar';

@Component({
  imports: [UcSidebar],
  template: `...`,
})
export class MyComponent {}
```

```html
<uc-sidebar [(opened)]="sidebarOpen">
  <uc-sidebar-button text="Home" [active]="true" />
</uc-sidebar>
```

## API

### Models

| Name     | Type      | Default | Description                                  |
|----------|-----------|---------|----------------------------------------------|
| `opened` | `boolean` | `true`  | Controls sidebar open/close state (two-way bindable) |
