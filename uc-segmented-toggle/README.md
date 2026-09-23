# UcSegmentedToggle Component

A segmented single-select button group built with content projection.

## Features

- Single selection at a time across all items
- Content projection per item (text, icon, or mixed content)
- Per-item disabled state
- Whole-group disabled state
- ARIA radio pattern (`radiogroup` and `radio`)
- Standalone Angular components

## Installation

Import directly from the library package:

```typescript
import { UcSegmentedToggle, UcSegmentedToggleItem } from '@enumsoftware/universal-components';

@Component({
  imports: [UcSegmentedToggle, UcSegmentedToggleItem],
  template: `...`,
})
export class ExampleComponent {}
```

## Basic Usage

```html
<uc-segmented-toggle [(value)]="selectedFilter">
  <uc-segmented-toggle-item value="all">All</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="products">Products</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="stores">Stores</uc-segmented-toggle-item>
</uc-segmented-toggle>
```

```typescript
selectedFilter = 'all';
```

## Text and Icon Projection

You can project any content inside each item.

```html
<uc-segmented-toggle [(value)]="selectedView">
  <uc-segmented-toggle-item value="list">List</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="grid" ariaLabel="Grid view">
    <i class="ph-bold ph-squares-four" aria-hidden="true"></i>
  </uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="map">
    <i class="ph-bold ph-map-pin" aria-hidden="true"></i>
    <span>Map</span>
  </uc-segmented-toggle-item>
</uc-segmented-toggle>
```

## Disabled States

Disable a single item:

```html
<uc-segmented-toggle [(value)]="selectedMode">
  <uc-segmented-toggle-item value="basic">Basic</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="advanced" [disabled]="true">Advanced</uc-segmented-toggle-item>
</uc-segmented-toggle>
```

Disable the entire group:

```html
<uc-segmented-toggle [(value)]="selectedMode" [disabled]="true">
  <uc-segmented-toggle-item value="a">A</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="b">B</uc-segmented-toggle-item>
</uc-segmented-toggle>
```

## API

### UcSegmentedToggle

#### Inputs

- `disabled: boolean` - Disables all toggle items.

#### Model (Two-Way Bindable)

- `value: string` - Currently selected item value.

### UcSegmentedToggleItem

#### Inputs

- `value: string` - Unique value for this item.
- `disabled: boolean` - Disables only this item.
- `ariaLabel: string | null` - Accessible name for icon-only items.

## Accessibility

- Group container uses `role="radiogroup"`.
- Each item uses `role="radio"` and sets `aria-checked`.
- Disabled semantics are exposed with `aria-disabled`.
- Icon-only items should set `ariaLabel` to provide a discernible name.
- Focus-visible styling is included for keyboard users.

## Workbench

See the showcase in `uc-segmented-toggle/uc-segmented-toggle.showcase.ts`.
