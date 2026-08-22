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

## Storybook

Public Storybook URL:

- https://enumsoftware.github.io/universal-components/

Deployment details:

- Storybook is automatically deployed to GitHub Pages when changes are pushed to `main`.
- Pull requests run build validation only (no deployment).
- If this is the first deployment, set repository Pages source to **GitHub Actions** in repository settings.

Run Storybook locally:

```bash
npm install --legacy-peer-deps
npm run storybook
```

Run accessibility checks against Storybook:

```bash
# terminal 1
npm run storybook

# terminal 2
npm run storybook:a11y
```

Expected result is all suites passing with no accessibility failures.

If Playwright browser binaries are missing on your machine, run:

```bash
npx playwright install chromium
```

Then open:

```text
http://localhost:6006
```

Build static Storybook output locally:

```bash
npm run storybook:build
```

This writes the static site to `storybook-static/`.

Story files live next to components using the `*.stories.ts` naming pattern.

### Documentation (addon-docs)

Auto-generated documentation is powered by [`@storybook/addon-docs`](https://storybook.js.org/docs/writing-docs).

- Autodocs is enabled globally via `tags: ['autodocs']` in [.storybook/preview.ts](.storybook/preview.ts), so every component gets a **Docs** tab derived from its stories, args, and controls.
- Add rich descriptions by writing JSDoc/TSDoc comments on component inputs and by using the `parameters.docs.description` fields in a story's meta.
- To write free-form documentation pages, add an `*.mdx` file next to the component (already matched by the `stories` glob in [.storybook/main.ts](.storybook/main.ts)) and reference stories with the `Meta`, `Canvas`, and `Story` blocks from `@storybook/blocks`.
- To opt a specific story out of autodocs, set `tags: ['!autodocs']` on that story's meta.

Docs pages are part of the standard Storybook build output. Running `npm run storybook:build` bundles them into `storybook-static/`, so the existing GitHub Pages deployment publishes them automatically — no extra CI configuration is required.


## Theming And Component Tokens

Global theme files are exported from the `themes/` directory. Import one of the following in your app's global stylesheet:

| Import | What it includes |
|--------|-----------------|
| `@enumsoftware/universal-components/themes/theme.css` | **Recommended.** Includes all built-in themes (`light`, `dark`, `aurora`, `midnight`), Google Fonts (Poppins), Phosphor icon styles, and flag-icons. |
| `@enumsoftware/universal-components/themes/uc-light.css` | Light theme variables only. Use when you need a single fixed theme or want to load themes on demand. |
| `@enumsoftware/universal-components/themes/uc-dark.css` | Dark theme variables only. Same use-case as above. |

> `theme.css` already `@import`s both `uc-light.css` and `uc-dark.css`, and each now defines two themes (`light` + `aurora`, `dark` + `midnight`), so importing it alone is sufficient for apps that support all built-in themes.

Use `data-theme="light"`, `data-theme="dark"`, `data-theme="aurora"`, or `data-theme="midnight"` on `html` or `body` to switch themes. Storybook exposes the same options from the global **Theme** toolbar.

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

Browse the interactive docs in Storybook under **Utilities** (Overview, Spacing, Flex, Grid).

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

The `scripts/` directory is excluded from the library and Storybook tsconfigs, so it has its own config and its own check:

```bash
npm run scripts:typecheck
```

## Notes

- This package is source-consumable. Host applications compile component source directly.
- No package publish/version bump is required for development workflow.
- Consumer lockfiles pin the resolved Git commit for reproducible builds.
- To move to newer component changes, update dependency lock and reinstall.
