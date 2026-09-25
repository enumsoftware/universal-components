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

## Icon and Text

Set `icon` to a Phosphor icon name (without the `ph-` prefix) to show it before the item's text.
`iconWeight` picks the Phosphor weight and defaults to `bold`.

```html
<uc-segmented-toggle [(value)]="selectedView">
  <uc-segmented-toggle-item value="list" icon="list-bullets">List</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="map" icon="map-pin">Map</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="grid" icon="squares-four" ariaLabel="Grid view" />
</uc-segmented-toggle>
```

An item with only an icon needs `ariaLabel`. The icon size is themed with
`--uc-segmented-toggle-item-icon-size`.

## Custom Prefix

For anything other than a Phosphor icon, such as a `uc-flag`, mark the element with
`ucSegmentedTogglePrefix`. It is placed where `icon` would be, before the text, wherever it is written
inside the item.

```html
<uc-segmented-toggle [(value)]="language" ariaLabel="Language">
  <uc-segmented-toggle-item value="hr">
    <uc-flag ucSegmentedTogglePrefix countryCode="hr" size="1.125rem" [circular]="true" />
    Hrvatski
  </uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="en">
    <uc-flag ucSegmentedTogglePrefix countryCode="gb" size="1.125rem" [circular]="true" />
    English
  </uc-segmented-toggle-item>
</uc-segmented-toggle>
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

## Pills Variant

`variant="pills"` draws each item as a separate, fully rounded pill with a gap between them, matching
the `pills` variant of `uc-tabs`.

```html
<uc-segmented-toggle [(value)]="selectedFilter" variant="pills">
  <uc-segmented-toggle-item value="all">All</uc-segmented-toggle-item>
  <uc-segmented-toggle-item value="products">Products</uc-segmented-toggle-item>
</uc-segmented-toggle>
```

Theme it with `--uc-segmented-toggle-pills-gap`, `--uc-segmented-toggle-pills-border-radius` and
`--uc-segmented-toggle-pills-hover-background`. The selected pill uses the
`--uc-segmented-toggle-item-selected-*` tokens.

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
- `variant: 'default' | 'pills'` - Joined segments in a track (default) or separate rounded pills.

#### Model (Two-Way Bindable)

- `value: string` - Currently selected item value.

### UcSegmentedToggleItem

#### Inputs

- `value: string` - Unique value for this item.
- `disabled: boolean` - Disables only this item.
- `ariaLabel: string | null` - Accessible name for icon-only items.
- `icon: string | null` - Phosphor icon name shown before the text.
- `iconWeight: PhosphorIconWeight` - Weight of `icon`. Defaults to `bold`.

## Accessibility

- Group container uses `role="radiogroup"`.
- Each item uses `role="radio"` and sets `aria-checked`.
- Disabled semantics are exposed with `aria-disabled`.
- Icon-only items should set `ariaLabel` to provide a discernible name.
- Focus-visible styling is included for keyboard users.

## Workbench

See the showcase in `uc-segmented-toggle/uc-segmented-toggle.showcase.ts`.
