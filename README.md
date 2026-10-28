# @enumsoftware/universal-components

Reusable Angular standalone UI components, built with ng-packagr into partially compiled ES modules
that the app's Angular build links and tree-shakes: an app only ships the components it uses.

## Install in a consumer app

```bash
npm install github:enumsoftware/universal-components#main
```

Installing from git runs the package's `prepare` script, which builds it.

## Import patterns

Most components come from the main entry point:

```ts
import { UcButton, UcInput } from '@enumsoftware/universal-components';
```

Three have their own entry points, so an app that does not use them never builds or ships their heavy
dependencies:

| Import from | Components | Brings in |
|---|---|---|
| `@enumsoftware/universal-components/uc-map` | `UcMap` | Google Maps (`@angular/google-maps`, and `@googlemaps/markerclusterer` on demand) |
| `@enumsoftware/universal-components/uc-charts` | `UcBarChart`, `UcLineChart`, `UcDoughnutChart` | d3 |
| `@enumsoftware/universal-components/uc-code-editor` | `UcCodeEditor` | Monaco, loaded on demand |

```ts
import { UcMap } from '@enumsoftware/universal-components/uc-map';
import { UcBarChart } from '@enumsoftware/universal-components/uc-charts';
import { UcCodeEditor } from '@enumsoftware/universal-components/uc-code-editor';
```

Only these paths are exported; importing a component's own file, such as
`@enumsoftware/universal-components/uc-button/uc-button`, is not supported and fails to resolve.

An app that uses `uc-code-editor` needs three entries in its `angular.json`: a `.ttf` loader,
Monaco's stylesheet in `styles`, and an `assets` entry that copies Monaco's editor worker, which ships
with this package. See [App build setup](uc-code-editor/README.md#app-build-setup).

## Component Docs

- [UcSegmentedToggle](uc-segmented-toggle/README.md)
- [UcBottomNavigation](uc-bottom-navigation/README.md)
- [UcBottomSheet](uc-bottom-sheet/README.md)
- [UcCodeEditor](uc-code-editor/README.md)
- [UcEditor](uc-editor/README.md)
- [UcMenu](uc-menu/README.md)
- [UcMap](uc-map/README.md)

## Compatibility

- Angular 22.x
- RxJS 7.8+

## Icons

- Phosphor icons are the default icon set.
- The package loads Phosphor styles from [themes/theme.css](themes/theme.css).
- Use the [uc-phosphor-icon/uc-phosphor-icon.ts](uc-phosphor-icon/uc-phosphor-icon.ts) component to render Phosphor icons (for example `trash`, `x`, or `arrow-right`).
- The [uc-sidebar-button/uc-sidebar-button.ts](uc-sidebar-button/uc-sidebar-button.ts) component now uses content projection for icons, so any icon element or component can be inserted.

## Workbench

Public URLs:

- https://enumsoftware.github.io/universal-components/

The Workbench is this repo's component explorer: a small Angular app that
renders every component with live controls, worked examples, generated API
docs, and an accessibility report. It replaced Storybook, which has been
removed. See [workbench/README.md](workbench/README.md) for how to write a
showcase.

Deployment details:

- The workbench is deployed to GitHub Pages only when a version tag (`v*`,
  for example `v0.1.3`) is pushed. Pushes to `main` and pull requests run the
  checks (token parity, script typecheck, workbench build, accessibility
  sweep) but do not deploy.
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

## Default Variants

Set which variant each control uses when a template does not choose one, once for the whole app:

```ts
import { provideUcDefaults } from '@enumsoftware/universal-components';

export const appConfig: ApplicationConfig = {
  providers: [provideUcDefaults({ button: { variant: 'secondary' }, tabs: { variant: 'pills' } })],
};
```

Controls that are not listed keep their built-in default, and a variant set on an element always wins. Covered controls: `anchor`, `badge`, `breadcrumbs`, `button`, `divider`, `iconButton`, `info`, `pill`, `segmentedToggle`, `sidebarButton` (its `style` input) and `tabs`. A lazy route can provide its own defaults, merged over the app's per control. The full table of options and built-in defaults is in the Workbench under **Foundations / Default Variants** (`uc-defaults/uc-defaults.docs.md`).

## Theming And Component Tokens

Global theme files are exported from the `themes/` directory. Import one of the following in your app's global stylesheet:

| Import | What it includes |
|--------|-----------------|
| `@enumsoftware/universal-components/themes/theme.css` | **Recommended.** Includes all built-in themes (`light`, `dark`, `aurora`, `midnight`), their Google Fonts, Phosphor icon styles, and flag-icons. |
| `@enumsoftware/universal-components/themes/theme-core.css` | Everything in `theme.css` except the Google Fonts request. Use it when the app loads its own fonts. |
| `@enumsoftware/universal-components/themes/uc-light.css` | Light theme variables only. Use when you need a single fixed theme or want to load themes on demand. Also `uc-dark.css`, `uc-aurora.css` and `uc-midnight.css`. |
| `@enumsoftware/universal-components/themes/fonts/light.css` | The Google Fonts of one theme, to pair with a single theme file. Also `fonts/dark.css`, `fonts/aurora.css`, `fonts/midnight.css`, and `fonts.css` for all four. |

> `theme.css` is `fonts.css` plus `theme-core.css`, and `theme-core.css` `@import`s all four theme files, so importing `theme.css` alone is sufficient for apps that support all built-in themes.

Use `data-theme="light"`, `data-theme="dark"`, `data-theme="aurora"`, or `data-theme="midnight"` on `html` or `body` to switch themes. The Workbench exposes the same options twice over: one picker for the app chrome, one for the preview canvas, so a component can be reviewed in dark on a light page.

### Typography

Every theme sets three font roles, and components read them instead of naming a font:

| Token | Used for |
|-------|----------|
| `--uc-font-family` | Body text and every component (`--uc-content-font-family` and `--uc-badge-font-family` default to it). |
| `--uc-font-family-heading` | `h1`–`h6`, `.uc-h1`–`.uc-h6` and `.uc-content` headings, through `--uc-content-heading-font-family`. |
| `--uc-font-family-mono` | `code`, `pre`, `kbd`, the `uc-editor` source view and `uc-info` code, through `--uc-content-inline-code-font-family` and `--uc-editor-source-font-family`. |

Built-in pairings, all from Google Fonts:

| Theme | Text | Headings | Code |
|-------|------|----------|------|
| `light` | Poppins | Poppins | JetBrains Mono |
| `dark` | Inter | Manrope | Fira Code |
| `aurora` | DM Sans | Space Grotesk | Space Mono |
| `midnight` | Plus Jakarta Sans | Sora | IBM Plex Mono |

`fonts.css` only declares `@font-face` rules, so a browser downloads the files of the theme that is actually on screen, not all four pairings.

To use your own fonts, import `theme-core.css` instead of `theme.css`, load the fonts however you like, and set the roles on the element that carries `data-theme`. The theme files derive the content, badge and editor font tokens from the roles in that same scope, so overriding the three roles there is enough:

```css
@import '@enumsoftware/universal-components/themes/theme-core.css';
@import '@fontsource-variable/geist';

[data-theme] {
	--uc-font-family: 'Geist Variable', system-ui, sans-serif;
	--uc-font-family-heading: var(--uc-font-family);
	--uc-font-family-mono: ui-monospace, monospace;
}
```

Set them on `[data-theme]` rather than `:root`: a theme scoped to `body` or to a nested element would otherwise shadow the root value.

#### Switching fonts separately from the theme

Set `data-font` next to `data-theme` to swap the pairing at runtime without changing colours. Leave it off to keep the theme's own fonts.

```html
<html data-theme="dark" data-font="dm-sans">
```

| `data-font` | Text | Headings | Code |
|-------------|------|----------|------|
| `poppins` | Poppins | Poppins | JetBrains Mono |
| `inter` | Inter | Manrope | Fira Code |
| `dm-sans` | DM Sans | Space Grotesk | Space Mono |
| `plus-jakarta-sans` | Plus Jakarta Sans | Sora | IBM Plex Mono |
| `system` | `system-ui` | `system-ui` | `ui-monospace` (no web font) |

The presets live in `themes/font-presets.css`, which `theme.css` and `theme-core.css` already include. They reuse the families `fonts.css` declares, so switching only downloads the faces that then render. `uc-code-editor` re-reads its font when `data-font` on `<html>` changes.

#### Font weights

Components never name a numeric weight. They read four tokens that every theme sets:

| Token | Default |
|-------|---------|
| `--uc-font-weight-regular` | `400` |
| `--uc-font-weight-medium` | `500` |
| `--uc-font-weight-semibold` | `600` |
| `--uc-font-weight-bold` | `700` |

If your font does not ship a weight, point the token at one it does, so the browser does not synthesise a faux bold:

```css
[data-theme] {
	--uc-font-weight-semibold: 700;
}
```

Per-component weight tokens (`--uc-button-font-weight`, `--uc-badge-font-weight`, ...) default to these, so they follow along.


Standard override model:

1. Semantic theme tokens (`--uc-primary-color`, `--uc-foreground-color`, `--uc-card-background-color`, etc.)
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
