# Agent Guidance

This repository includes Angular skills under `.agents/skills/`.

## Use These Skills

- Use the `angular-developer` skill for Angular component, service, template, styling, accessibility, testing, Storybook, routing, signals, forms, DI, and general Angular best-practice work in this repo.
- Use the `angular-new-app` skill only when the task is to scaffold a brand new Angular application. This repository is an Angular library, not an application.

## Repository Context

- This package is an Angular 22 standalone component library.
- Primary validation for code changes is `npm run build`.
- For component behavior changes, prefer narrow tests first, then run broader validation only if needed.
- Storybook is available through `npm run storybook` when interactive component verification is useful.

## Working Conventions

- Keep changes minimal and aligned with existing standalone component patterns.
- Preserve public APIs unless the task explicitly requires an API change.
- Match existing CSS, template, and story structure within each component directory.