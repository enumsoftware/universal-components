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

## Compatibility

- Angular 22.x
- RxJS 7.8+

## Icons

- Phosphor icons are the default icon set.
- The package loads Phosphor styles from [themes/theme.css](themes/theme.css), matching usage in the dynamic-qr-code app.
- Use icon names with the `phosphorIcon` input, for example `trash`, `x`, or `arrow-right`.

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

## Theming And Component Tokens

Global theme files are in [themes/theme.css](themes/theme.css):

- [themes/uc-light.css](themes/uc-light.css)
- [themes/uc-dark.css](themes/uc-dark.css)
- [themes/uc-component-tokens.css](themes/uc-component-tokens.css)

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

## Notes

- This package is source-consumable. Host applications compile component source directly.
- No package publish/version bump is required for development workflow.
- Consumer lockfiles pin the resolved Git commit for reproducible builds.
- To move to newer component changes, update dependency lock and reinstall.
