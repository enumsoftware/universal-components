---
name: uc-troubleshoot-storybook-tokens
description: Diagnose and fix universal-components issues around missing token parity, Storybook Angular typing failures, and missing public exports.
---

# Universal Components Troubleshooting Workflow

Use this skill when requests mention any of the following:

- `tokens:check` failures
- Storybook type failures (`render` signature, `Meta`/`StoryObj` typing, Angular renderer return type mismatches)
- Consumer import/export failures from `@enumsoftware/universal-components`

## Fast diagnostic checklist

1. Capture failing command and exact error.
2. Run baseline validation:
   - `npm run build`
   - `npm run tokens:check`
   - `npm run storybook:build` (or `npm run storybook` for interactive checks)
3. Classify the failure and apply the targeted fix path below.
4. Re-run the originally failing command.

## Fix path A - token parity failures

If `npm run tokens:check` reports missing variables:

1. Add missing `--uc-*` variables in both theme files:
   - `themes/uc-light.css`
   - `themes/uc-dark.css`
2. Keep naming and fallback semantics consistent with component usage.
3. Re-run `npm run tokens:check` until it passes.

## Fix path B - Storybook Angular typing failures

If Storybook reports type mismatches in stories:

1. Align story types with current Storybook Angular types (`Meta`, `StoryObj`, and renderer expectations).
2. Ensure `render` returns a valid Angular story return shape.
3. Keep args strongly typed to the story host/component contract.
4. Re-run `npm run storybook:build`.

## Fix path C - missing export failures in consumers

If consumers cannot import an expected symbol:

1. Verify symbol is exported in `public-api.ts`.
2. Build library (`npm run build`) and confirm emitted declaration output.
3. If needed, update consumer dependency pin/version after confirming export is present.

## Completion criteria

- Original failing command passes.
- `npm run build` passes.
- `npm run tokens:check` passes for token-related changes.
- Storybook build passes for story/type changes.
