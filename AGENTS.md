# Agent Guidance

This repository includes Angular skills under `.agents/skills/`.

## Use These Skills

- Use the `angular-developer` skill for Angular component, service, template, styling, accessibility, testing, Storybook, routing, signals, forms, DI, and general Angular best-practice work in this repo.
- Use the `angular-new-app` skill only when the task is to scaffold a brand new Angular application. This repository is an Angular library, not an application.
- Use `uc-troubleshoot-storybook-tokens` when `tokens:check` fails, Storybook typing breaks, or consumer export/import mismatches appear.

## Repository Context

- This package is an Angular 22 standalone component library.
- Primary validation for code changes is `npm run build`.
- For component behavior changes, prefer narrow tests first, then run broader validation only if needed.
- Storybook is available through `npm run storybook` when interactive component verification is useful.

## Agent quick start

Use these commands during validation:

- Build library: `npm run build`
- Unit tests: `npm run test`
- Theme token parity check: `npm run tokens:check`
- Regenerate layout utilities: `npm run utilities:build`
- Typecheck build scripts: `npm run scripts:typecheck`
- Storybook local: `npm run storybook`
- Storybook static build: `npm run storybook:build`
- Storybook accessibility checks: `npm run storybook:a11y`

For setup, import patterns, and Storybook publishing behavior, use `README.md` as the source of truth.

## Working Conventions

- Keep changes minimal and aligned with existing standalone component patterns.
- Preserve public APIs unless the task explicitly requires an API change.
- Match existing CSS, template, and story structure within each component directory.

## Theming and token safeguards

- When adding or renaming `--uc-*` variables, keep `themes/uc-light.css` and `themes/uc-dark.css` in sync in the same change.
- Run `npm run tokens:check` after any component style-token update.
- If a consumer reports missing exports, verify `public-api.ts` and run `npm run build` before changing downstream apps.
- For Storybook type errors, align story render signatures and args types with current Angular Storybook typings before introducing workarounds.

## Documentation index

- Main package usage and theming: `README.md`
- Public export surface: `public-api.ts`
- Theme files: `themes/theme.css`, `themes/uc-light.css`, `themes/uc-dark.css`
- Layout utilities: `themes/utilities.css` (barrel) and `themes/utilities/*.css` (parts). All generated from `scripts/utilities/*.ts` via `scripts/build-utilities.ts`; never edit the CSS by hand. Documented in `README.md` and Storybook under `Utilities/`

## Instruction maintenance loop

Run `/chronicle improve` periodically (for example weekly) and incorporate only repeated, repository-specific troubleshooting patterns into AGENTS and skill docs.