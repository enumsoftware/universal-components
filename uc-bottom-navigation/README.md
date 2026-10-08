# UcBottomNavigation Component

A bar of top-level destinations along the bottom of the screen, as phone apps have.

## Features

- The items are the app's own `<a>` or `<button>` elements, so routing stays with the app (`routerLink`,
  `href` or a click handler); the library has no router dependency
- Icon over label, the current item with a filled icon on a pill in the primary colour
- `aria-current="page"` on the current item and a named `<nav>` landmark
- Optional badge per item, icon-only mode, a width from which the bar hides, and a fixed position
- Clears the home indicator on phones (`env(safe-area-inset-bottom)`)
- Themed with `--uc-bottom-navigation-*` tokens

## Installation

```typescript
import { UcBottomNavigation, UcBottomNavigationItem } from '@enumsoftware/universal-components';

@Component({
  imports: [RouterLink, UcBottomNavigation, UcBottomNavigationItem],
  template: `...`,
})
export class AppShell {}
```

## Basic Usage

Mark each link with `ucBottomNavigationItem` and tell it whether it is the current page:

```html
<uc-bottom-navigation label="Main navigation">
  <a routerLink="/" ucBottomNavigationItem icon="bus" [active]="isLines()">Lines</a>
  <a routerLink="/stops" ucBottomNavigationItem icon="map-pin" [active]="isStops()">Stops</a>
  <a routerLink="/info" ucBottomNavigationItem icon="info" [active]="isInfo()">Info</a>
</uc-bottom-navigation>
```

`active` is set by the app, so a destination can stay current on its child pages (for example `/lines/12`
under Lines), which `routerLinkActive` alone does not do.

## Only on Phones

`hideFrom` hides the bar from a viewport width (in px) up, for apps that show the same destinations in a
header or sidebar on wider screens:

```html
<uc-bottom-navigation label="Main navigation" [hideFrom]="640">...</uc-bottom-navigation>
```

## In the Layout or Fixed

By default the bar is part of the page flow; put it last in a full-height column layout:

```css
.shell {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100dvh;
}
```

`[fixed]="true"` pins it to the bottom of the viewport instead. The page then needs room for it underneath,
for example `padding-bottom: calc(3.5rem + env(safe-area-inset-bottom))`.

## Badges

```html
<a routerLink="/messages" ucBottomNavigationItem icon="chat-circle" [badge]="unread()">Messages</a>
```

`null` shows no badge. Theme it with `--uc-bottom-navigation-item-badge-background` and `-badge-color`.

## Icon Only

`[showLabels]="false"` keeps the labels for screen readers but hides them from view. Give each item an
`ariaLabel` as well, so its name does not depend on hidden text.

```html
<uc-bottom-navigation label="Main navigation" [showLabels]="false">
  <a routerLink="/" ucBottomNavigationItem icon="house" ariaLabel="Home" [active]="isHome()">Home</a>
</uc-bottom-navigation>
```

## Custom Icon

For anything other than a Phosphor icon, put an element marked `ucBottomNavigationItemIcon` inside the
item; it takes the icon's place:

```html
<a routerLink="/me" ucBottomNavigationItem [active]="isMe()">
  <uc-avatar ucBottomNavigationItemIcon name="Ana Horvat" size="1.5rem" />
  Profile
</a>
```

## Theming

| Token | Default |
|---|---|
| `--uc-bottom-navigation-background` | `--uc-background-color` |
| `--uc-bottom-navigation-border` | 1px `--uc-divider-color` on top |
| `--uc-bottom-navigation-shadow` | `none` |
| `--uc-bottom-navigation-z-index` | `100` (fixed bar) |
| `--uc-bottom-navigation-item-color` | `--uc-paragraph-text-color` |
| `--uc-bottom-navigation-item-active-color` | `--uc-primary-color` |
| `--uc-bottom-navigation-item-active-background` | primary at 12% (the pill behind the icon) |
| `--uc-bottom-navigation-item-hover-background` | foreground at 6% |
| `--uc-bottom-navigation-item-font-size` | `0.75rem` |
| `--uc-bottom-navigation-item-icon-size` | `1.375rem` |
| `--uc-bottom-navigation-item-min-height` | `3.5rem` |
| `--uc-bottom-navigation-item-badge-background` | `--uc-error-color` |
| `--uc-bottom-navigation-item-badge-color` | `--uc-inverse-foreground-color` |

## API

### UcBottomNavigation

- `label: string | null` - Accessible name of the `<nav>` landmark.
- `hideFrom: number | null` - Viewport width in px from which the bar is hidden; `null` or 0 always shows it.
- `fixed: boolean` - Pins the bar to the bottom of the viewport. Defaults to `false`.
- `showLabels: boolean` - Shows the text under each icon. Defaults to `true`.

### UcBottomNavigationItem

On `a[ucBottomNavigationItem]` or `button[ucBottomNavigationItem]`.

- `icon: string | null` - Phosphor icon name, without the `ph-` prefix.
- `iconWeight: PhosphorIconWeight` - Weight of the icon. Defaults to `regular`.
- `activeIconWeight: PhosphorIconWeight` - Weight while the item is current. Defaults to `fill`.
- `active: boolean` - The current destination; sets `aria-current="page"`.
- `badge: string | number | null` - A count or mark on the icon.
- `ariaLabel: string | null` - Accessible name, needed with `showLabels` off.

## Accessibility

- The bar is a `<nav>` landmark named by `label`.
- The current item has `aria-current="page"`, so screen readers announce it as the current page.
- Items are the app's own links and buttons, so keyboard and focus behave as for any link or button.
- The badge is hidden from screen readers; include the count in the item's text or `ariaLabel` when it
  matters.

## Workbench

See the showcase in `uc-bottom-navigation/uc-bottom-navigation.showcase.ts`.
