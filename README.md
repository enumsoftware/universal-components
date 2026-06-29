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

## Notes

- This package is source-consumable. Host applications compile component source directly.
- No package publish/version bump is required for development workflow.
- Consumer lockfiles pin the resolved Git commit for reproducible builds.
- To move to newer component changes, update dependency lock and reinstall.
