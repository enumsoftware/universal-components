# UcButtonToggle Component

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
import { UcButtonToggle, UcButtonToggleItem } from '@enumsoftware/universal-components';

@Component({
  imports: [UcButtonToggle, UcButtonToggleItem],
  template: `...`,
})
export class ExampleComponent {}
```

## Basic Usage

```html
<uc-button-toggle [(value)]="selectedFilter">
  <uc-button-toggle-item value="all">All</uc-button-toggle-item>
  <uc-button-toggle-item value="products">Products</uc-button-toggle-item>
  <uc-button-toggle-item value="stores">Stores</uc-button-toggle-item>
</uc-button-toggle>
```

```typescript
selectedFilter = 'all';
```

## Text and Icon Projection

You can project any content inside each item.

```html
<uc-button-toggle [(value)]="selectedView">
  <uc-button-toggle-item value="list">List</uc-button-toggle-item>
  <uc-button-toggle-item value="grid" ariaLabel="Grid view">
    <i class="ph-bold ph-squares-four" aria-hidden="true"></i>
  </uc-button-toggle-item>
  <uc-button-toggle-item value="map">
    <i class="ph-bold ph-map-pin" aria-hidden="true"></i>
    <span>Map</span>
  </uc-button-toggle-item>
</uc-button-toggle>
```

## Disabled States

Disable a single item:

```html
<uc-button-toggle [(value)]="selectedMode">
  <uc-button-toggle-item value="basic">Basic</uc-button-toggle-item>
  <uc-button-toggle-item value="advanced" [disabled]="true">Advanced</uc-button-toggle-item>
</uc-button-toggle>
```

Disable the entire group:

```html
<uc-button-toggle [(value)]="selectedMode" [disabled]="true">
  <uc-button-toggle-item value="a">A</uc-button-toggle-item>
  <uc-button-toggle-item value="b">B</uc-button-toggle-item>
</uc-button-toggle>
```

## API

### UcButtonToggle

#### Inputs

- `disabled: boolean` - Disables all toggle items.

#### Model (Two-Way Bindable)

- `value: string` - Currently selected item value.

### UcButtonToggleItem

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

See the showcase in `uc-button-toggle/uc-button-toggle.showcase.ts`.
