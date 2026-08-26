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

## Media hashing is load-bearing

The build sets `outputHashing: "media"` on the base options, not just on a
configuration. `flag-icons` ships `flags/1x1/ad.svg` and `flags/4x3/ad.svg` -
same basename, different bytes - and esbuild flattens every asset into
`media/`, so without content hashes the two collide and the build fails with
270-odd "Two output files share the same path" errors. Production happened to
hide this behind `outputHashing: "all"`; the dev server did not.

## Not built yet

Phase 0 covers the format, the registry, the playground, examples and the theme
toolbar. Still to come: markdown and API tables on the Docs tab (phase 2), the
axe-core run in CI (phase 4), and the other 40 story files (phase 3).
