A small, opt-in layout layer that ships next to the components: flexbox, CSS
Grid, margin, padding and gap helpers. Everything is plain CSS - there is
nothing to import into an Angular module and no build step in the consuming app.

## Install

The utility layer is **not** part of `theme.css`, so existing apps pay nothing
for it until they ask for it. Add it to your global stylesheet:

```css
@import '@enumsoftware/universal-components/themes/theme.css';
@import '@enumsoftware/universal-components/themes/utilities.css';
```

## Naming

Every class is `uc-` prefixed so it cannot collide with Tailwind, Bootstrap or
your own CSS:

```text
uc-<utility>                 applies at every width      uc-flex, uc-p-4
uc-<breakpoint>-<utility>    applies from that width up  uc-md-flex-row, uc-lg-p-8
```

Breakpoints are mobile-first `min-width` queries: `sm` 640px, `md` 768px,
`lg` 1024px, `xl` 1280px.

## Side names are logical

Side helpers map to CSS logical properties, not physical ones. `uc-ms-4` is
`margin-inline-start`, so it is the left margin in LTR and the right margin in
RTL - no RTL stylesheet needed.

## Customising

The scale lives in custom properties, so redefine the steps you want after the
import:

```css
:root {
  --uc-space-4: 0.875rem; /* retunes uc-p-4, uc-m-4, uc-gap-4, ... at once */
  --uc-grid-min: 18rem;   /* default track width for uc-grid-auto-fit */
}
```

Utilities are single-class selectors with no `!important`, so component styles
and your own more specific rules still win where you need them to.
