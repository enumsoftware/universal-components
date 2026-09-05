# UcTabs

A tab bar with associated content panels. Tabs are driven by a data array and content is projected with the `[ucTabPanel]` directive.

## Features

- **Data-driven tabs**: Pass a `UcTab[]` array to render the tab bar
- **Content panels**: Project panel content with `*ucTabPanel="'key'"` structural directive
- **Two-way active tab**: `activeTab` is a model signal bound to a tab key
- **Accessible**: Renders a proper tab/tabpanel structure

## Usage

```typescript
import { UcTabs, UcTabPanel } from '@enumsoftware/universal-components';

@Component({
  imports: [UcTabs, UcTabPanel],
  template: `...`,
})
export class MyComponent {}
```

### Basic

```typescript
tabs: UcTab[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'details',  label: 'Details' },
  { key: 'history',  label: 'History' },
];

activeTab = signal('overview');
```

```html
<uc-tabs [tabs]="tabs" [(activeTab)]="activeTab">
  <ng-template ucTabPanel="overview">
    <p>Overview content.</p>
  </ng-template>

  <ng-template ucTabPanel="details">
    <p>Details content.</p>
  </ng-template>

  <ng-template ucTabPanel="history">
    <p>History content.</p>
  </ng-template>
</uc-tabs>
```

## API

### UcTabs Inputs / Models

| Name        | Type       | Default  | Description                                       |
|-------------|------------|----------|---------------------------------------------------|
| `tabs`      | `UcTab[]`  | Required | Tab definitions (key + label pairs)               |
| `activeTab` | `string` (model, required) | Required | Key of the currently active tab  |

### UcTab interface

```typescript
interface UcTab {
  key: string;
  label: string;
}
```

### UcTabPanel directive

Applied as `[ucTabPanel]="'key'"` on an `<ng-template>`. The key must match a `UcTab.key` value.
