A navigation trail showing where the current page sits in the app's hierarchy.
It renders a `<nav>` landmark around an ordered list, with a separator between
crumbs.

```html
<uc-breadcrumbs>
  <a *ucBreadcrumb href="/">Home</a>
  <a *ucBreadcrumb routerLink="/catalog">Catalog</a>
  <span *ucBreadcrumb aria-current="page">Shoes</span>
</uc-breadcrumbs>
```

## Crumbs are your own elements

`*ucBreadcrumb` is a structural directive: the element it sits on is rendered
unchanged inside the list. A crumb can be a plain `<a href>`, an
`<a routerLink>` or anything else - the library has no router dependency, and
middle click, ctrl/cmd-click and "open in new tab" keep working because the link
is a real link. Use `<ng-template ucBreadcrumb>` for a crumb made of several
elements.

Mark the current page yourself with `aria-current="page"`, usually on a
`<span>` as the last crumb. The last crumb is also styled with
`--uc-breadcrumbs-current-color`.

## Separator

`separator` sets the text drawn between crumbs (`/` by default). For anything
richer, such as an icon, project a template - it wins over `separator`:

```html
<ng-template ucBreadcrumbSeparator><i class="ph ph-caret-right"></i></ng-template>
```

Separators are their own `aria-hidden` list items, so a screen reader announces
only the crumbs.

## Collapsing

When there are more crumbs than `maxItems` (8 by default), the middle ones
collapse behind an ellipsis button. `itemsBeforeCollapse` and
`itemsAfterCollapse` (1 each) choose how many crumbs stay visible on each side.
Activating the button expands the full path and moves focus to the first crumb
it revealed. `expandText` is the button's accessible name.

## Variants

`plain` (the default) is text links. `pills` gives every crumb a rounded
background. The app-wide default is set with
`provideUcDefaults({ breadcrumbs: { variant: 'pills' } })`.

## Tokens

| Token                                     | Default                          |
| ----------------------------------------- | -------------------------------- |
| `--uc-breadcrumbs-color`                  | `var(--uc-paragraph-text-color)` |
| `--uc-breadcrumbs-hover-color`            | `var(--uc-primary-color)`        |
| `--uc-breadcrumbs-current-color`          | `var(--uc-foreground-color)`     |
| `--uc-breadcrumbs-separator-color`        | `var(--uc-paragraph-text-color)` |
| `--uc-breadcrumbs-font-size`              | `0.875rem`                       |
| `--uc-breadcrumbs-font-weight`            | `500`                            |
| `--uc-breadcrumbs-gap`                    | `0.5rem`                         |
| `--uc-breadcrumbs-pills-background`       | foreground at 6%                 |
| `--uc-breadcrumbs-pills-hover-background` | foreground at 12%                |
| `--uc-breadcrumbs-pills-border-radius`    | `100px`                          |
| `--uc-breadcrumbs-pills-padding`          | `0.25rem 0.75rem`                |
