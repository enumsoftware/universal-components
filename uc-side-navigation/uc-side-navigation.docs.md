The component sizes itself from its parent container. Set a height on any parent
wrapper - `400px`, `60vh`, or a container query - and `uc-side-navigation` fills
that height without reaching for viewport units.

In `side` mode a closed sidebar is fully hidden and non-interactive: no pointer
events and nothing focusable inside it.

In `side` mode the sidebar has an end border (`1px solid var(--uc-divider-color)`)
that separates it from the content. Change it with `--uc-side-navigation-sidebar-border`,
or set that variable to `none` to remove it. The floating `over` sidebar has no border.

`sidebarVariant` controls how the `over` sidebar sits in its container. The default
`floating` variant is inset 16px from the edges with rounded corners
(`--uc-side-navigation-sidebar-border-radius`). `flush` places it against the top, left
and bottom edges with square corners. `side` mode ignores the variant.

Content marked `ucSidebarHeader` sits above the sidebar body and stays in place while
the body scrolls, like `ucSidebarFooter` below it.

## Two sidebars

A second `uc-sidebar` with `side="end"` sits on the other side of the content, with its
own `ucEndSidebarHeader` and `ucEndSidebarFooter`. Write `side` as a plain attribute:
the slots are picked from the markup, so a bound `[side]` would leave the sidebar at the
start. The end sidebar is `--uc-side-navigation-end-sidebar-width` wide.

`openSidebar`, `closeSidebar` and `toggleSidebar` take the side (`'start'` by default),
and `isEndSidebarOpen` reports the end one. In `side` mode both are docked at once; in
`over` mode one is open at a time, and opening one closes the other.

## Where an over sidebar opens

`overlayScope` sets where an `over` sidebar and its backdrop go. With `viewport` (the
default) they open in the CDK overlay and the backdrop covers the whole window. With
`container` they stay inside the component: the backdrop covers only its content, and
the page around it (an app header, a toolbar) stays visible and usable.

A contained sidebar closes on its backdrop and on Escape like the other. Focus moves into
it when it opens and back to what had it before when it closes. The content under the
backdrop is `inert` meanwhile, but the page around it is not, so the sidebar is not
modal: give it no `aria-modal`. Menus and selects inside it still open in the CDK overlay.

## Edges and resizing

`edge` on `uc-sidebar` sets how the side facing the content is drawn: `line` (the
default) is the border, `grip` adds a handle in the middle, `none` draws nothing.

With `resizable` the edge can be dragged, or focused and moved with the arrow keys
(Shift for bigger steps, Home and End for `minWidth` and `maxWidth`); double-click
resets it. While it is hovered, focused or dragged it takes
`--uc-side-navigation-edge-active-color`; with a grip only the grip does, and the
line under it turns `--uc-side-navigation-grip-line-color`. The width is a two-way
`width` (px): bind it to remember what the user chose. Unset, the width token
applies. Name the edge for screen readers with `resizeLabel`. The edge reports its
width as `aria-valuenow`, the rendered width until one has been dragged.

The look comes from `--uc-side-navigation-edge-hit-width`,
`--uc-side-navigation-edge-active-width`, `--uc-side-navigation-grip-color`,
`--uc-side-navigation-grip-length` and `--uc-side-navigation-grip-thickness`.

## Landmarks

The content area is a `<main>` landmark, since the component is usually the app shell.
A document may only have one, so set `[mainLandmark]="false"` when the page already
has a `<main>` or shows several side navigations at once; the content then renders in
a `<div>` with the same styling.
