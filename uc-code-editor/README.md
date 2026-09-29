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
import { UcCodeEditor } from '@enumsoftware/universal-components/uc-code-editor';

@Component({
  imports: [UcCodeEditor],
  // ...
})
export class MyComponent {}
```

`monaco-editor` is a regular dependency of this package (not a peer dependency), so no extra
install step is required. It is a separate entry point, so apps without a code editor never build Monaco.

### App build setup

Monaco needs three entries in the app's `angular.json`, under the build target's `options`:

```json
"loader": { ".ttf": "file" },
"styles": [
  "node_modules/monaco-editor/min/vs/editor/editor.main.css",
  "src/styles.css"
],
"assets": [
  {
    "glob": "editor.worker.js",
    "input": "node_modules/@enumsoftware/universal-components/dist/uc-code-editor",
    "output": "uc-code-editor"
  }
]
```

- **`loader`**: Monaco's stylesheets reference an icon font. Without it the build fails with
  "No loader is configured for \".ttf\" files".
- **`styles`**: Monaco imports its CSS from JavaScript, and an Angular build writes that out but never
  links it, so without this line the editor is partly unstyled (its hidden input shows as an empty box
  above the code). Keep the app's own stylesheets in the list.
- **`assets`**: copies Monaco's editor worker, which ships prebuilt with this package, to
  `uc-code-editor/editor.worker.js` in the build output. Without it the worker 404s, Monaco logs errors
  and falls back to running on the main thread, which can make typing in large files sluggish.

If the app serves the worker from another path, tell the editor where:

```ts
import { provideUcCodeEditorConfig } from '@enumsoftware/universal-components/uc-code-editor';

export const appConfig: ApplicationConfig = {
  providers: [provideUcCodeEditorConfig({ workerUrl: 'assets/monaco/editor.worker.js' })],
};
```

The URL is resolved against the page's `<base href>`.

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

The worker is prebuilt by `scripts/build-code-editor-worker.ts` as part of `npm run build`, into
`dist/uc-code-editor/editor.worker.js`: one self-contained file with no imports left to resolve. An
app's Angular build does not bundle a `new Worker(new URL(...))` found inside `node_modules`, so the
worker cannot be referenced relative to the library's own code; the app copies the file instead (see
[App build setup](#app-build-setup)).

Because only the generic worker ships, Monaco's JSON, CSS, HTML and TypeScript language services,
which each expect their own worker, are switched off: no validation, symbol outline, colour
decorators or IntelliSense. Highlighting stays for every language, and folding follows indentation.
An app that sets `self.MonacoEnvironment` itself before the first editor loads, for example with all of
Monaco's per-language workers, keeps its own setup and the full language services.

This setup was verified in an app that installs the package and builds it in production: the worker
loads from `uc-code-editor/editor.worker.js`, highlighting works for JSON and TypeScript, and the console
stays clean.

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
