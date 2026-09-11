# UcCodeEditor Component

A code editor and viewer built on [Monaco](https://microsoft.github.io/monaco-editor/) (the editor
that powers VS Code), with a configurable edit/preview mode, a copy-to-clipboard button, and a
language badge.

## Features

- **Monaco-powered editing**: Full syntax highlighting, bracket matching, folding, and keyboard
  handling for every language Monaco knows (TypeScript, C#, JSON, and dozens more)
- **Edit / Preview modes**: Set `mode` to render either an editable surface or a read-only one,
  without swapping components. There is no in-toolbar control for it — the consumer decides
- **Copy button**: Copies the current content to the clipboard, with a "Copied" confirmation state
- **Language badge**: Displays a human-readable language name (`csharp` → `C#`), overridable per
  instance
- **Form integration**: Implements `FormValueControl<string | null>` for reactive forms
- **Theme-aware**: Follows this library's `data-theme` attribute (or `prefers-color-scheme` when
  that attribute is absent) to pick Monaco's light/dark theme, or can be pinned explicitly
- **Lazy-loaded**: Monaco is only imported the first time a `uc-code-editor` actually renders, so
  consumers who never use it pay nothing for it

## Installation

The component is standalone and can be imported directly:

```typescript
import { UcCodeEditor } from '@enumsoftware/universal-components';

@Component({
  imports: [UcCodeEditor],
  // ...
})
export class MyComponent {}
```

`monaco-editor` is a regular dependency of this package (not a peer dependency), so no extra
install step is required.

## Basic Usage

```html
<uc-code-editor id="snippet" label="Snippet" language="typescript" [(value)]="code" />
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `...`,
})
export class ExampleComponent {
  code = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`;
}
```

### Preview-only viewer

Set `mode="preview"` to use it as a read-only, syntax-highlighted code viewer:

```html
<uc-code-editor id="output" label="Result" language="json" mode="preview" [value]="jsonOutput" />
```

### Other languages

```html
<uc-code-editor id="model" label="Model" language="csharp" [(value)]="csharpCode" />
<uc-code-editor id="config" label="Config" language="json" [(value)]="jsonConfig" />
```

## API

### Inputs

| Input               | Type                             | Default        | Description                                                       |
| ------------------- | --------------------------------- | -------------- | ------------------------------------------------------------------ |
| `id`                | `string`                          | Required        | Unique identifier; also the id of the Monaco mount element         |
| `label`             | `string`                          | `''`            | Label text displayed above the editor                              |
| `hideLabel`         | `boolean`                         | `false`         | Hides the label visually, keeps it for a11y                        |
| `language`          | `string`                          | `'plaintext'`   | Monaco language id (`'typescript'`, `'csharp'`, `'json'`, ...)      |
| `languageLabel`     | `string \| null`                  | `null`          | Overrides the badge text; otherwise derived from `language`        |
| `mode`              | `'edit' \| 'preview'`             | `'edit'`        | Whether the editor is editable or read-only; set by the consumer, no in-toolbar control |
| `height`            | `string`                          | `'320px'`       | CSS height of the editor surface                                    |
| `showLanguageBadge` | `boolean`                         | `true`          | Shows/hides the language badge                                      |
| `showCopyButton`    | `boolean`                         | `true`          | Shows/hides the copy button                                         |
| `minimap`           | `boolean`                         | `false`         | Enables Monaco's minimap                                            |
| `wordWrap`          | `boolean`                         | `false`         | Wraps long lines instead of scrolling horizontally                  |
| `fontSize`          | `number`                          | `13`            | Editor font size in pixels                                          |
| `theme`             | `'auto' \| 'light' \| 'dark'`     | `'auto'`        | `auto` follows `data-theme` / `prefers-color-scheme`                |
| `editorOptions`     | `Monaco.editor.IStandaloneEditorConstructionOptions` | `{}` | Escape hatch merged into Monaco's construction options last |
| `disabled`          | `boolean`                         | `false`         | Disables editing (implies read-only)                                |
| `readonly`          | `boolean`                         | `false`         | Makes the editor read-only without the disabled styling             |
| `hidden`            | `boolean`                         | `false`         | Hides the component                                                  |
| `errors`            | `ValidationError[]`               | `[]`            | Array of validation errors to display                                |
| `disabledReasons`   | `DisabledReason[]`                 | `[]`            | Reasons why the editor is disabled                                   |

### Models (Two-Way Bindable)

| Model     | Type                   | Description                                       |
| --------- | ---------------------- | -------------------------------------------------- |
| `value`   | `string \| null`       | The current code content                            |
| `touched` | `boolean`              | Whether the editor has been interacted with         |

### Methods

| Method                    | Parameters              | Description                                  |
| ------------------------- | ------------------------ | --------------------------------------------- |
| `copyToClipboard()`       | -                         | Copies the current content to the clipboard   |

## Monaco loading

`uc-code-editor` imports `monaco-editor` lazily, the first time an instance of the component
actually initializes, and reuses that single import across every instance on the page. It wires up
one generic Monaco worker (`editor.worker`) rather than the dedicated per-language workers (ts,
json, css, html): this keeps the worker footprint and bundler configuration small, at the cost of
live IntelliSense-style diagnostics. Syntax highlighting, bracket matching, folding, and editing
still work for every language Monaco ships a grammar for.

This relies on `new Worker(new URL('./uc-code-editor.worker', import.meta.url), { type: 'module' })`.
Angular's esbuild-based application builder requires that path to be a real relative file rather
than a bare `monaco-editor/...` specifier (it resolves the argument as a literal path next to the
importing file, not through node_modules), which is why the actual `monaco-editor` worker import
is delegated to the colocated `uc-code-editor.worker.ts` instead of being inlined directly.

This has only been verified against this repo's own workbench app (Angular's esbuild application
builder, consuming the component's TypeScript source directly). It has **not** been verified
end-to-end against a consumer that installs this package from npm and builds with `ng-packagr` in
between: `ng-packagr` bundles everything reachable through real imports into one FESM file, and it
is not confirmed that the colocated worker file still ends up at the right relative path next to
that bundle, or that `ng-packagr`/a consumer's bundler resolves this worker-bundling convention the
same way the workbench's dev server does. If you hit a "could not resolve" error for
`uc-code-editor.worker` (or the editor silently runs without a worker) in a real downstream build,
that is the likely cause — please report it.

## Styling

The component uses CSS custom properties for theming, consistent with the rest of this library:

```css
:root {
  --uc-code-editor-label-color: #333;
  --uc-code-editor-toolbar-background: #fafafa;
  --uc-code-editor-toolbar-border-color: #ddd;
  --uc-code-editor-border-color: #ddd;
  --uc-code-editor-border-radius: 0.75rem;
  --uc-code-editor-status-color: #666;
  --uc-code-editor-error-color: #d32f2f;
}
```

Monaco's own theme (`vs` / `vs-dark`) is controlled by the `theme` input, not by CSS custom
properties, since Monaco paints its own canvas rather than reading page styles. Monaco themes are
global to the page rather than scoped per editor instance, so if a page renders multiple
`uc-code-editor`s with conflicting explicit `theme` values, the most recently created or updated
instance wins for all of them. Leaving `theme` at its `auto` default on every instance avoids this,
since they all resolve to the same value from the same `data-theme`/`prefers-color-scheme` source.

## Accessibility

- The label is associated with the editor via `aria-labelledby`/`for`
- Monaco receives an `ariaLabel` derived from `label` (or `'Code editor'` as a fallback)
- Validation errors are announced the same way as other form components in this library

## Testing

```bash
npm test
```

## References

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/docs.html)
