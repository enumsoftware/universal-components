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

## Docs

Prose lives in a sibling markdown file - `uc-button/uc-button.docs.md` next to
`uc-button.showcase.ts` - picked up by filename, with nothing to register.

It is a separate file rather than a `docs:` field because markdown is
backtick-heavy: inline code and fenced blocks cannot survive inside a template
literal without escaping every backtick. A `.md` file also gets real editor
support.

The generator compiles it with `marked` at build time and emits finished HTML,
so no markdown parser ships in the bundle. The workbench renders it inside
`.uc-content`, which means the library's own prose styles apply - with the
heading scale retuned locally, since `--uc-content-h1-size` is tuned for
marketing pages rather than a docs panel.

## The API table

Generated, not written. `scripts/showcase/api.ts` walks the component with the
TypeScript AST and pulls out every `input()`, `model()` and `output()` with its
name, alias, required flag, declared type, default and JSDoc. Plain signals and
methods are skipped.

It reads syntactically rather than through a type checker: the library declares
its members in one consistent shape, so matching the call expression is both
sufficient and far cheaper than building a Program per showcase. The trade-off
is that inherited members are not picked up - no component in the library
currently inherits inputs.

This is what replaces Storybook's autodocs argTypes, and it is strictly better
for this codebase: signal inputs are read from source, so `model.required()`
shows as a required model of type `unknown` rather than being missed.

Docs and API ship as one lazy chunk per showcase, fetched the first time the
Docs tab is opened - reading one component's docs does not download the other
thirty-five.

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

## Preview hosts

Some components cannot be driven bare. A pure content-projection surface
(`uc-card`, `uc-info`) renders an empty box with no children, and a controlled
component (`uc-pagination`, `uc-editor`, `uc-tabs`) is a dead control unless
something holds its state and feeds it back.

Those showcases point `component` at a small **preview** under `examples/` that
forwards the knobs and supplies whatever the real component needs. It is the
same shape a consuming app would write, so the canvas still shows real usage
rather than a rigged demo.

## Presets merge over knob defaults

An example that sets `props` states only what it changes; the knob defaults sit
underneath. Without that, a required input the preset does not mention is never
set and the component throws NG0950. An example that brings its own
`component` owns all of its inputs and gets no merge.

## Accessibility

Every showcase is checked with [axe-core](https://github.com/dequelabs/axe-core)
against WCAG 2.1 AA plus axe's own best practices, in two places that share one
definition of the check:

- the **Accessibility tab**, which runs axe against the live canvas at the
  current knob values and preview theme, and
- `npm run a11y`, which sweeps all 41 showcases in CI.

Both import `A11Y_RUN_OPTIONS` from `core/a11y.ts`. Two configurations would
mean a component could look clean in the tab and still fail the merge.

The sweep visits two surfaces per showcase - the Playground canvas at its knob
defaults, and every canvas on the Examples tab at once - in **both themes**,
because colour contrast is a property of the theme, not of the component.

```
npm run workbench:build     # the sweep runs against the built app
npm run a11y                # check
npm run a11y -- --details   # ...and print every offending element
npm run a11y:update         # record the current result as the new baseline
```

### Why a baseline instead of zero

`scripts/a11y-baseline.json` records what fails today, and the gate is the diff
against it. The library has real contrast debt; a check that is red from its
first commit gets ignored within a week. The baseline makes the debt explicit
in one reviewable file and still fails the build the moment a component gets
worse.

Fixing something fails too, with a one-line instruction to record it. That
symmetry is deliberate - it is the only thing keeping the file from quietly
drifting out of date.

The recorded counts are per rendered element, so they depend on the browser
doing the rendering. Pin `playwright` when changing it, and expect to re-record
if the Chromium version moves.

### What it found

145 failing elements, all `color-contrast`, across seven components -
`uc-calendar` alone accounts for 126 (the weekday labels and the adjacent-month
day numbers), with the rest in `uc-editor`, `uc-date-time-picker`, `uc-pill`,
`uc-avatar`, `uc-accordion` and `uc-info`. These are muted greys that fall
under 4.5:1, and they are recorded rather than fixed: changing them is a visual
decision about shipped components.

Note what it does **not** catch: the `uc-checkbox` defect above passes axe
cleanly. A `div` that is styled to look like a checkbox but claims no role is
invisible to a rule engine too - it has nothing to check. Automated checks
raise the floor; they do not replace using the component with a keyboard.

### The chrome gives up its landmarks

The workbench shell deliberately uses no `<main>`, `<header>` or `<footer>`.
The canvas renders whole page fragments, and several carry landmarks of their
own - `uc-side-navigation` emits a `<main>`, and the utilities overview
demonstrates a full page layout. Any landmark the chrome claims collides with
the one being demonstrated, and axe was right to call that a failure. It is the
chrome's to give up: nothing in it is the page's main content, the preview is.

The first sweep reported 18 such findings. All were the workbench's own bugs,
not the library's, and fixing them is what the first `a11y` commit did.

### data-surface

Each canvas carries `data-surface="playground"` or `data-surface="examples"`.
For a moment after a tab click both canvases are in the DOM, so "a canvas
exists" cannot tell the sweep which one it is measuring - it would grade the
wrong surface, or throw when that canvas vanished mid-run. The attribute makes
each answer unambiguous.

## Media hashing is load-bearing

The build sets `outputHashing: "media"` on the base options, not just on a
configuration. `flag-icons` ships `flags/1x1/ad.svg` and `flags/4x3/ad.svg` -
same basename, different bytes - and esbuild flattens every asset into
`media/`, so without content hashes the two collide and the build fails with
270-odd "Two output files share the same path" errors. Production happened to
hide this behind `outputHashing: "all"`; the dev server did not.

## Not built yet

Phases 0 to 4 are done: the format, the registry, the playground, examples,
both theme toolbars, shareable URL state, viewport presets, the Docs tab with
compiled markdown and a generated API table, all 41 showcases migrated, the
Accessibility tab, and the axe sweep gating CI.

Still to come: removing Storybook itself (phase 5) - the seven dependencies,
`.storybook/`, the 41 `*.stories.ts` files and the scripts that drive them.

**Pages now publishes the workbench, not Storybook.** Storybook still builds in
CI so it cannot rot before it is deleted, but `dist-workbench/browser` is what
gets deployed. The workbench reached parity in phase 3, so nothing went
undocumented in the swap.
