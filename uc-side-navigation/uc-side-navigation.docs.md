The component sizes itself from its parent container. Set a height on any parent
wrapper - `400px`, `60vh`, or a container query - and `uc-side-navigation` fills
that height without reaching for viewport units.

In `side` mode a closed sidebar is fully hidden and non-interactive: no pointer
events and nothing focusable inside it.

In `side` mode the sidebar has an end border (`1px solid var(--uc-divider-color)`)
that separates it from the content. Change it with `--uc-side-navigation-sidebar-border`,
or set that variable to `none` to remove it. The floating `over` sidebar has no border.

Content marked `ucSidebarHeader` sits above the sidebar body and stays in place while
the body scrolls, like `ucSidebarFooter` below it.
