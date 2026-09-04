# @enumsoftware/universal-components

Reusable Angular standalone UI components consumed directly from source.

## Install in a consumer app

```bash
npm install github:enumsoftware/universal-components#main
```

## Import patterns

Use either the public API:

```ts
import { UcButton, UcInput } from '@enumsoftware/universal-components';
```

Or deep imports for component-level usage:

```ts
import { UcButton } from '@enumsoftware/universal-components/uc-button/uc-button';
```

## Component Docs

- [UcButtonToggle](uc-button-toggle/README.md)
- [UcEditor](uc-editor/README.md)
- [UcMenu](uc-menu/README.md)

## Compatibility

- Angular 22.x
- RxJS 7.8+

## Icons

- Phosphor icons are the default icon set.
- The package loads Phosphor styles from [themes/theme.css](themes/theme.css).
- Use the [uc-phosphor-icon/uc-phosphor-icon.ts](uc-phosphor-icon/uc-phosphor-icon.ts) component to render Phosphor icons (for example `trash`, `x`, or `arrow-right`).
- The [uc-sidebar-button/uc-sidebar-button.ts](uc-sidebar-button/uc-sidebar-button.ts) component now uses content projection for icons, so any icon element or component can be inserted.

## Workbench

Public URL:

- https://enumsoftware.github.io/universal-components/

The Workbench is this repo's component explorer: a small Angular app that
renders every component with live controls, worked examples, generated API
docs, and an accessibility report. It replaced Storybook, which has been
removed. See [workbench/README.md](workbench/README.md) for how to write a
showcase.

Deployment details:

- The workbench is automatically deployed to GitHub Pages when changes are
  pushed to `main`.
- Pull requests run build validation and the accessibility sweep only (no
  deployment).
- If this is the first deployment, set repository Pages source to **GitHub
  Actions** in repository settings.

Run it locally:

```bash
npm install
npm run workbench
```

Then open:

```text
http://localhost:4200
```

Showcase files live next to components using the `*.showcase.ts` naming
pattern, with prose in a sibling `*.docs.md`. The **Docs** tab compiles that
markdown at build time and appends an API table extracted from the component's
`input()`, `model()` and `output()` declarations, so inputs are documented from
the source rather than by hand.

Build the static site locally:

```bash
npm run workbench:build
```

This writes the site to `dist-workbench/browser/`.

### Accessibility checks

Every showcase is checked with axe-core against WCAG 2.1 AA plus axe's own best
practices - interactively on each component's **Accessibility** tab, and across
all of them in CI:

```bash
npm run workbench:build
npm run a11y                # check against scripts/a11y-baseline.json
npm run a11y -- --details   # ...and print every offending element
npm run a11y:update         # record the current result as the new baseline
```

The gate is the diff against the recorded baseline, so a regression fails the
build while the library's existing contrast debt stays visible in one reviewable
file. If Playwright browser binaries are missing on your machine:

```bash
npx playwright install chromium
```

## Theming And Component Tokens

Global theme files are exported from the `themes/` directory. Import one of the following in your app's global stylesheet:

| Import | What it includes |
|--------|-----------------|
| `@enumsoftware/universal-components/themes/theme.css` | **Recommended.** Includes all built-in themes (`light`, `dark`, `aurora`, `midnight`), Google Fonts (Poppins), Phosphor icon styles, and flag-icons. |
| `@enumsoftware/universal-components/themes/uc-light.css` | Light theme variables only. Use when you need a single fixed theme or want to load themes on demand. |
| `@enumsoftware/universal-components/themes/uc-dark.css` | Dark theme variables only. Same use-case as above. |

> `theme.css` already `@import`s both `uc-light.css` and `uc-dark.css`, and each now defines two themes (`light` + `aurora`, `dark` + `midnight`), so importing it alone is sufficient for apps that support all built-in themes.

Use `data-theme="light"`, `data-theme="dark"`, `data-theme="aurora"`, or `data-theme="midnight"` on `html` or `body` to switch themes. The Workbench exposes the same options twice over: one picker for the app chrome, one for the preview canvas, so a component can be reviewed in dark on a light page.

Standard override model:

1. Semantic theme tokens (`--primary-color`, `--foreground-color`, `--card-background-color`, etc.)
2. Standardized component tokens (`--uc-token-*`), for example `--uc-token-uc-button-background`
3. Per-component variables (`--uc-button-background`, etc.) still work and are resolved inside component host styles

This gives one consistent extension path for all components while keeping backward compatibility.

Example:

```css
[data-theme='dark'] {
	--uc-token-uc-button-background: #2d6cff;
	--uc-token-uc-button-border-radius: 9999px;
	--uc-token-uc-input-label-color: #e2e8f0;
}
```

## Layout Utilities

A small, opt-in CSS layer with flexbox, grid and spacing helpers. It is plain CSS — nothing to import into an Angular module, no build step in the consuming app.

It is **not** included in `theme.css`, so apps that do not want it pay nothing. Add it explicitly:

```css
@import '@enumsoftware/universal-components/themes/theme.css';
@import '@enumsoftware/universal-components/themes/utilities.css';
```

Browse the interactive docs in the Workbench under **Utilities** (Overview, Spacing, Flex, Grid).

### Importing only what you use

`utilities.css` is a barrel that `@import`s the parts below. To ship less CSS, skip it and import the parts you need instead:

```css
@import '@enumsoftware/universal-components/themes/utilities/scale.css';
@import '@enumsoftware/universal-components/themes/utilities/flex.css';
@import '@enumsoftware/universal-components/themes/utilities/alignment.css';
@import '@enumsoftware/universal-components/themes/utilities/gap.css';
```

| File | Contains | Needs |
|------|----------|-------|
| `utilities/scale.css` | `--uc-space-*` and `--uc-grid-min` tokens | — |
| `utilities/display.css` | `uc-block`, `uc-flex`, `uc-grid`, `uc-hidden`, … | — |
| `utilities/sizing.css` | `uc-w-*`, `uc-h-*`, `uc-max-w-*`, `uc-box-border` | — |
| `utilities/flex.css` | direction, wrap, item sizing, order | `alignment.css` |
| `utilities/grid.css` | column/row templates, placement, flow, implicit tracks | `alignment.css` |
| `utilities/alignment.css` | `uc-justify-*`, `uc-items-*`, `uc-content-*`, `uc-self-*`, `uc-place-*` | — |
| `utilities/gap.css` | `uc-gap-*`, `uc-gap-x-*`, `uc-gap-y-*` | `scale.css` |
| `utilities/margin.css` | `uc-m*-*`, auto margins, negative margins | `scale.css` |
| `utilities/padding.css` | `uc-p*-*` | `scale.css` |
| `utilities/composites.css` | `uc-flex-center`, `uc-grid-auto-fit`, … | — |

Alignment is its own sheet because flex and grid containers use the same classes.

### Naming

Every class is `uc-` prefixed, so the layer cannot collide with Tailwind, Bootstrap or app CSS.

```text
uc-<utility>                 applies at every width       uc-flex, uc-p-4
uc-<breakpoint>-<utility>    applies from that width up   uc-md-flex-row, uc-lg-p-8
```

Breakpoints are mobile-first `min-width` queries:

| Prefix | Applies from |
|--------|--------------|
| _(none)_ | all widths |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

### Spacing scale

`margin`, `padding` and `gap` share one scale. Steps: `0`, `px`, `1` (0.25rem), `2`, `3`, `4` (1rem), `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24` (6rem).

| Prefix | Property |
|--------|----------|
| `uc-m-*` / `uc-p-*` | `margin` / `padding` |
| `uc-mx-*` / `uc-px-*` | `margin-inline` / `padding-inline` |
| `uc-my-*` / `uc-py-*` | `margin-block` / `padding-block` |
| `uc-mt-*` / `uc-pt-*` | `margin-block-start` / `padding-block-start` |
| `uc-mb-*` / `uc-pb-*` | `margin-block-end` / `padding-block-end` |
| `uc-ms-*` / `uc-ps-*` | `margin-inline-start` / `padding-inline-start` |
| `uc-me-*` / `uc-pe-*` | `margin-inline-end` / `padding-inline-end` |
| `uc-gap-*`, `uc-gap-x-*`, `uc-gap-y-*` | `gap`, `column-gap`, `row-gap` |

Sides use CSS **logical** properties, so `uc-ms-4` is the left margin in LTR and the right margin in RTL with no extra stylesheet.

Margins also accept `auto` (`uc-mx-auto`, `uc-ms-auto`) and negative steps with an `n` prefix (`uc-mt-n4`). Negative margins are base-breakpoint only.

### Class reference

| Group | Classes | Responsive variants |
|-------|---------|---------------------|
| Display | `uc-block`, `uc-inline-block`, `uc-inline`, `uc-flex`, `uc-inline-flex`, `uc-grid`, `uc-inline-grid`, `uc-contents`, `uc-hidden` | yes |
| Sizing | `uc-w-full\|half\|auto\|fit\|min\|max`, `uc-h-full\|auto\|fit\|min\|max`, `uc-max-w-full\|none`, `uc-max-h-full\|none` | yes |
| Box sizing | `uc-box-border`, `uc-box-content` | no |
| Flex container | `uc-flex-row\|col` (+ `-reverse`), `uc-flex-wrap\|nowrap\|wrap-reverse` | yes |
| Flex item | `uc-flex-1\|auto\|initial\|none`, `uc-grow`, `uc-grow-0`, `uc-shrink`, `uc-shrink-0`, `uc-basis-0\|auto\|full\|1-2\|1-3\|2-3\|1-4\|3-4`, `uc-order-first\|last\|none\|1..12`, `uc-min-w-0`, `uc-min-h-0` | yes |
| Grid container | `uc-grid-cols-1..12\|none\|subgrid`, `uc-grid-rows-1..6\|none\|subgrid`, `uc-grid-flow-row\|col\|dense\|row-dense\|col-dense`, `uc-auto-cols-*`, `uc-auto-rows-*` | yes |
| Grid item | `uc-col-span-1..12\|full`, `uc-col-start-1..13\|auto`, `uc-col-end-1..13\|auto`, `uc-row-span-1..6\|full`, `uc-row-start-1..7`, `uc-row-end-1..7`, `uc-col-auto`, `uc-row-auto` | yes |
| Alignment | `uc-justify-*`, `uc-items-*`, `uc-content-*`, `uc-self-*`, `uc-justify-self-*`, `uc-justify-items-*`, `uc-place-items-*`, `uc-place-content-*` | yes |
| Gap | `uc-gap-*`, `uc-gap-x-*`, `uc-gap-y-*` | yes |
| Margin | `uc-m-*`, `uc-mx\|my-*`, `uc-mt\|mb\|ms\|me-*`, `*-auto` | yes |
| Padding | `uc-p-*`, `uc-px\|py-*`, `uc-pt\|pb\|ps\|pe-*` | yes |
| Negative margin | `uc-mt-n4`, `uc-mx-n2`, … | no |
| Composites | `uc-flex-center`, `uc-flex-col-center`, `uc-flex-between`, `uc-grid-auto-fit`, `uc-grid-auto-fill` | no |

`uc-grid-auto-fit` and `uc-grid-auto-fill` build a responsive track list from `--uc-grid-min` (default `16rem`) with no media queries:

```html
<div class="uc-grid-auto-fit uc-gap-4" style="--uc-grid-min: 20rem">…</div>
```

### Customising

The scale is exposed as custom properties. Redefine only what you need, after the import:

```css
:root {
	--uc-space-4: 0.875rem; /* retunes uc-p-4, uc-m-4, uc-gap-4, … at once */
	--uc-grid-min: 18rem;
}
```

Utilities are single-class selectors with no `!important`, so component styles and your own more specific rules still win where you need them to.

### Regenerating the stylesheets

`themes/utilities.css` and everything in `themes/utilities/` are generated, so base classes and their responsive variants cannot drift apart. **Never edit the CSS by hand** — change the generator instead:

| Source | Produces |
|--------|----------|
| [scripts/utilities/types.ts](scripts/utilities/types.ts) | the `UtilitySheet` / `UtilityGroup` / `Rule` types every module is checked against |
| [scripts/utilities/shared.ts](scripts/utilities/shared.ts) | the spacing scale, shared value maps and rule helpers → `scale.css` |
| [scripts/utilities/display.ts](scripts/utilities/display.ts) | `display.css` |
| [scripts/utilities/sizing.ts](scripts/utilities/sizing.ts) | `sizing.css` |
| [scripts/utilities/flex.ts](scripts/utilities/flex.ts) | `flex.css` |
| [scripts/utilities/grid.ts](scripts/utilities/grid.ts) | `grid.css` |
| [scripts/utilities/alignment.ts](scripts/utilities/alignment.ts) | `alignment.css` |
| [scripts/utilities/spacing.ts](scripts/utilities/spacing.ts) | `gap.css`, `margin.css`, `padding.css` |
| [scripts/utilities/composites.ts](scripts/utilities/composites.ts) | `composites.css` |
| [scripts/build-utilities.ts](scripts/build-utilities.ts) | breakpoints, rendering, and the `utilities.css` barrel |

Each sheet module default-exports an array of `UtilitySheet` values. Adding a sheet means adding a module and listing it in the `SHEETS` array in `build-utilities.ts`; the barrel imports and the file header follow automatically, and the generator warns if the new file has no matching `exports` entry in `package.json`. Then run:

```bash
npm run utilities:build
```

Commit the regenerated stylesheets with the generator change.

The generator is TypeScript run through **Node's native type stripping** — `node scripts/build-utilities.ts`, no compile step, no `ts-node`/`tsx` dependency. Two consequences worth knowing:

- Relative imports carry the real `.ts` extension (`import { space } from './shared.ts'`), and type-only imports must use `import type` — Node erases types without understanding them, so a value import of a type would fail at runtime.
- The source must stay erasable: no `enum`, `namespace`, or parameter properties. [scripts/tsconfig.json](scripts/tsconfig.json) sets `erasableSyntaxOnly` and `verbatimModuleSyntax` so the typechecker catches both rules rather than letting them fail at runtime.

The `scripts/` directory is excluded from every app tsconfig, so it has its own config and its own check:

```bash
npm run scripts:typecheck
```

## Notes

- This package is source-consumable. Host applications compile component source directly.
- No package publish/version bump is required for development workflow.
- Consumer lockfiles pin the resolved Git commit for reproducible builds.
- To move to newer component changes, update dependency lock and reinstall.
