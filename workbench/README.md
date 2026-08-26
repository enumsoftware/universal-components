# Workbench

The component workbench: a plain Angular application that replaces Storybook.

```bash
npm run workbench          # dev server
npm run workbench:build    # static build into dist-workbench/
npm run workbench:registry # regenerate the showcase registry by hand
```

## Writing a showcase

A showcase lives next to the component it documents, as `<component>.showcase.ts`,
and default-exports `defineShowcase({ ... })`. The registry generator picks it up
by filename - there is nothing to register.

```ts
import { bool, defineShowcase, select, text } from "../workbench/core";
import { BUTTON_VARIANT_OPTIONS, UcButton } from "./uc-button";
import { WithPrefixIconExample } from "./examples/with-prefix-icon";

export default defineShowcase({
  id: "components/button", // route + deep link, must be unique
  group: "Components", // sidebar section
  title: "Button",
  component: UcButton, // omit for a docs-only page
  docs: "Markdown.",
  knobs: {
    text: text("Click Me"),
    variant: select(BUTTON_VARIANT_OPTIONS, "primary"),
    disabled: bool(false),
  },
  examples: [
    { name: "Secondary", props: { variant: "secondary" } },
    { name: "With Prefix Icon", component: WithPrefixIconExample },
  ],
});
```

`id`, `group`, `title` and `order` must be **literals**. The generator reads them
straight out of the source so the sidebar can render without importing every
showcase, which is what keeps each one a lazy chunk.

## Knobs

`knobs` is keyed to the component's real signal inputs, so renaming an input
fails the build rather than silently producing a dead control. Helpers:
`text`, `bool`, `number`, `select`, `color`, `object`.

## Examples: presets vs components

Two kinds, and the distinction matters:

- **`props`** reuses the showcase component with preset inputs. Use it for
  anything that is just a different combination of inputs.
- **`component`** renders a real standalone component you write under
  `examples/`. Use it for content projection, sibling components, or local
  state.

The `component` form is why this replaced Storybook's `render`: an example is
ordinary Angular, so it is AOT compiled and checked under `strictTemplates`.
The template strings it replaces were never type checked at all.

Outputs are discovered with `reflectComponentType` and logged in the Actions
panel automatically - there is nothing to declare. A `model()` is skipped there,
since every knob edit would otherwise echo back into the log.

## The workbench is built from the library

The chrome is assembled out of the components it documents - `uc-input`,
`uc-select`, `uc-checkbox`, `uc-card`, `uc-tabs`, `uc-button`, `uc-pill`,
`uc-divider`, `uc-sidebar-button` - and styled from library tokens
(`--primary-color`, `--card-background-color`, `--sidebar-background-color`,
`--paragraph-text-color`) rather than a private palette. The workbench is the
library's largest consumer, so a regression shows up here before it reaches an
app.

Two consequences worth knowing:

**Bind `id` as a property, never as a static attribute.** A `uc-*` component
that declares an `id` input still receives a static `id="x"` on its host
element, so the id lands in the DOM twice - once on the host, once on the inner
control. Always write `[id]="'wb-filter'"`.

**There are two themes, not one.** `chrome` themes the workbench and lives on
`<html>`; `canvas` themes the preview and lives on the canvas wrapper. They
nest rather than fight, because custom properties cascade and the inner
`[data-theme]` redefines tokens for its own subtree. Keeping them separate is
what lets you compare a component across themes without the surrounding UI
moving underneath you.

## Known library defects surfaced here

`uc-checkbox` is mouse-only and invisible to assistive technology. Its painted
control is a bare `div` with no `role`, no `tabindex` and no key handler; the
real `input[type=checkbox]` is `visibility: hidden` and never bound to
`checked()`, so it is neither focusable nor state-accurate, and the
`<label for>` points at it. An aria snapshot of the controls panel reports
zero checkbox roles - both boolean knobs collapse into a plain text node. The
end-to-end suite asserts this defect explicitly, so fixing the component turns
that check red and tells you to update it.

## Shareable links

Playground state rides in the query string, so a link carries what you were
looking at:

```
#/components/button?args={"text":"Shared","variant":"error"}&theme=aurora&vw=768
```

- `args` - only the knobs that differ from their declared default, as JSON. A
  showcase at rest writes no query string at all, so the common "open it and
  send it" link stays clean.
- `theme` - the preview theme. Omitted for `light`.
- `vw` - the viewport preset. Omitted for `auto`.

Writes are debounced and use `replaceUrl`, so typing in a text knob neither
thrashes the router nor fills the back button. Decoding never throws: a
hand-edited or truncated `args` falls back to the defaults.

## Canvas layouts

`centered` (the default), `padded` and `fullscreen`, set per showcase or per
example. The canvas is deliberately `box-sizing: border-box` **scoped to
itself** rather than via a page-wide reset - a global `border-box` would change
how library components lay out inside the canvas versus inside a consuming app,
which would make the preview a liar.

## Media hashing is load-bearing

The build sets `outputHashing: "media"` on the base options, not just on a
configuration. `flag-icons` ships `flags/1x1/ad.svg` and `flags/4x3/ad.svg` -
same basename, different bytes - and esbuild flattens every asset into
`media/`, so without content hashes the two collide and the build fails with
270-odd "Two output files share the same path" errors. Production happened to
hide this behind `outputHashing: "all"`; the dev server did not.

## Not built yet

Phases 0 and 1 cover the format, the registry, the playground, examples, both
theme toolbars, shareable URL state and viewport presets. Still to come:
markdown and API tables on the Docs tab (phase 2), the axe-core run in CI
(phase 4), and the other 40 story files (phase 3).

The `padded` and `fullscreen` canvas layouts are implemented but no migrated
showcase uses them yet - they get their first real exercise in phase 3, when
`uc-side-navigation` and the utilities pages come across.
