---
name: uc-troubleshoot-tokens-exports
description: Diagnose and fix universal-components issues around missing token parity, missing public exports, and workbench showcase or accessibility failures.
---

# Universal Components Troubleshooting Workflow

Use this skill when requests mention any of the following:

- `tokens:check` failures
- Consumer import/export failures from `@enumsoftware/universal-components`
- `npm run a11y` failing against the recorded baseline
- Workbench build failures coming from a `*.showcase.ts`

## Fast diagnostic checklist

1. Capture failing command and exact error.
2. Run baseline validation:
   - `npm run build`
   - `npm run tokens:check`
   - `npm run workbench:build`
3. Classify the failure and apply the targeted fix path below.
4. Re-run the originally failing command.

## Fix path A - token parity failures

If `npm run tokens:check` reports missing variables:

1. Add missing `--uc-*` variables in both theme files:
   - `themes/uc-light.css`
   - `themes/uc-dark.css`
2. Keep naming and fallback semantics consistent with component usage.
3. Re-run `npm run tokens:check` until it passes.

## Fix path B - missing export failures in consumers

If consumers cannot import an expected symbol:

1. Verify symbol is exported in `public-api.ts`.
2. Build library (`npm run build`) and confirm emitted declaration output.
3. If needed, update consumer dependency pin/version after confirming export is present.

## Fix path C - accessibility baseline failures

`npm run a11y` compares the sweep against `scripts/a11y-baseline.json` and fails
on any difference, in either direction. Read the direction before acting:

- **`new` or a larger count** is a regression. Fix the component; do not record it.
- **`fixed` or a smaller count** is an improvement that still has to be recorded:
  `npm run a11y:update`, and say in the commit what was fixed.

The sweep runs against the built app, so `npm run workbench:build` has to be
current or the numbers describe the previous build. Counts are per rendered
element and therefore Chromium-version-dependent; a wholesale shift across many
components after a `playwright` bump is a re-record, not a regression.

## Fix path D - showcase build failures

A `*.showcase.ts` is typechecked against the component it points at, so these
are usually real drift rather than workbench problems:

1. A knob keyed to an input that no longer exists - rename or drop the knob.
2. An example `props` missing a required input - presets merge over knob
   defaults, so this only fires when the showcase itself declares no default.
3. `select()` with an inline array - add `as const`, or import the component's
   exported `*_OPTIONS` tuple.
4. Re-run `npm run workbench:build`.

## Completion criteria

- Original failing command passes.
- `npm run build` passes.
- `npm run tokens:check` passes for token-related changes.
- `npm run workbench:build` and `npm run a11y` pass for showcase or
  accessibility changes.
