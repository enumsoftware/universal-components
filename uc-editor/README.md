# UcEditor Component

A small WYSIWYG editor for document formats. The component owns the editing surface, the toolbar and
the selection state; everything format-specific lives behind the `UcEditorFormat` interface, so HTML
and Markdown are two implementations of the same contract and a third format is a class, not a fork.

## Features

- Rich text editing on a `contenteditable` surface, with a source view for the raw document
- Toolbar assembled from library building blocks (`uc-select`, `uc-button-toggle`, `uc-icon-button`, `uc-button`,
  `uc-input`, `uc-divider`)
- `UcEditorFormat` seam: parse, serialize and command support per format
- Built-in `html` and `markdown` formats
- Commands hidden automatically when the active format cannot express them
- Allowlist sanitizing on every path that reaches the surface, including paste
- Signal forms compatible (`FormValueControl<string>`), with `errors`, `disabled`, `readonly`,
  `invalid` and `touched`

## Installation

```typescript
import { UcEditor } from '@enumsoftware/universal-components';

@Component({
  imports: [UcEditor],
  template: `...`,
})
export class ExampleComponent {}
```

## Basic Usage

```html
<uc-editor id="article" label="Article" format="html" [(value)]="article" />
```

```typescript
article = signal('<h1>Hello</h1><p>Written in HTML.</p>');
```

Switch the format and the same component reads and writes Markdown instead:

```html
<uc-editor id="notes" label="Notes" format="markdown" [(value)]="notes" />
```

```typescript
notes = signal('# Hello\n\nWritten in Markdown.');
```

`value` always holds the document in the active format's source text, never an intermediate
representation.

## Restricting The Toolbar

```html
<uc-editor
  id="comment"
  format="markdown"
  [commands]="['paragraph', 'bold', 'italic', 'bulletList', 'link']"
  [showStatusBar]="false"
  [(value)]="comment"
/>
```

Commands the format does not support are dropped from this list as well, so a shared toolbar
configuration stays valid across formats.

## Adding A Format

Implement `UcEditorFormat` and pass the instance to `format`. The editing surface is always an HTML
DOM, so a format converts between that DOM and its own source text and declares which commands it
can round-trip.

```typescript
import { UcEditorCommand, UcEditorFormat, sanitizeEditorHtml } from '@enumsoftware/universal-components';

export class PlainTextEditorFormat implements UcEditorFormat {
  readonly id = 'text';
  readonly label = 'Plain text';
  readonly mimeType = 'text/plain';
  readonly fileExtensions = ['.txt'] as const;

  supports(command: UcEditorCommand): boolean {
    return ['paragraph', 'bulletList', 'clearFormatting', 'undo', 'redo'].includes(command);
  }

  toEditorHtml(source: string): string {
    return sanitizeEditorHtml(source.split('\n').map((line) => `<p>${line || '<br>'}</p>`).join(''));
  }

  fromEditorHtml(html: string): string {
    const container = document.createElement('div');
    container.innerHTML = sanitizeEditorHtml(html);
    return [...container.children].map((child) => child.textContent ?? '').join('\n').trim();
  }
}
```

```html
<uc-editor id="notes" [format]="plainText" [(value)]="notes" />
```

`ucEditorFormatForFileName('changelog.md')` resolves a built-in format from a file name, which is
useful when opening a dropped file.

## API

### Inputs

- `id: string` (required) - Id applied to the editing surface, also used to derive child ids.
- `label: string` - Accessible label rendered above the editor.
- `hideLabel: boolean` - Keep the label for assistive technology only.
- `placeholder: string` - Shown while the document is empty.
- `format: 'html' | 'markdown' | UcEditorFormat` - Active document format. Defaults to `'html'`.
- `commands: UcEditorCommand[] | null` - Toolbar allowlist. Defaults to everything the format supports.
- `showSourceToggle: boolean` - Show the rich text / source switch. Defaults to `true`.
- `showStatusBar: boolean` - Show the format and character count row. Defaults to `true`.
- `disabled`, `readonly`, `hidden`, `invalid`, `errors`, `disabledReasons` - Signal forms inputs.

### Models (Two-Way Bindable)

- `value: string` - Document source text in the active format.
- `touched: boolean` - Set when the surface loses focus.
- `view: 'wysiwyg' | 'source'` - Active view.

### Commands

`paragraph`, `heading1`, `heading2`, `heading3`, `bold`, `italic`, `underline`, `strikethrough`,
`inlineCode`, `bulletList`, `orderedList`, `blockquote`, `codeBlock`, `link`, `image`,
`horizontalRule`, `clearFormatting`, `undo`, `redo`.

Markdown hides `underline`, since it has no syntax for it.

### Exported Helpers

- `UC_EDITOR_HTML_FORMAT`, `UC_EDITOR_MARKDOWN_FORMAT` - Shared format instances.
- `UcHtmlEditorFormat`, `UcMarkdownEditorFormat` - Format classes.
- `resolveUcEditorFormat`, `ucEditorFormatForFileName` - Format lookup.
- `markdownToHtml`, `htmlToMarkdown` - The Markdown conversion used by the Markdown format.
- `sanitizeEditorHtml` - Allowlist sanitizer used on every path into the surface.

## Styling

Component tokens follow the library convention and are defined in every theme file:
`--uc-editor-background`, `--uc-editor-color`, `--uc-editor-border-color`,
`--uc-editor-border-radius`, `--uc-editor-focus-color`, `--uc-editor-label-color`,
`--uc-editor-toolbar-background`, `--uc-editor-toolbar-border-color`, `--uc-editor-toolbar-gap`,
`--uc-editor-toolbar-padding`, `--uc-editor-content-padding`, `--uc-editor-min-height`,
`--uc-editor-max-height`, `--uc-editor-font-family`, `--uc-editor-font-size`,
`--uc-editor-line-height`, `--uc-editor-placeholder-color`, `--uc-editor-panel-background`,
`--uc-editor-source-background`, `--uc-editor-source-color`, `--uc-editor-source-font-family`,
`--uc-editor-status-background`, `--uc-editor-status-color`, `--uc-editor-error-color`,
`--uc-editor-disabled-opacity`.

Document content inside the surface is rendered through `innerHTML`, so it is styled by the global
prose defaults in `themes/theme.css`. The editor only scales the heading sizes down for editor
context, which means consumer theming of `--uc-content-*` applies here too.

## Accessibility

- The toolbar uses `role="toolbar"`; every control has a discernible name.
- The surface uses `role="textbox"` with `aria-multiline` and is labelled by the rendered label.
- Inline mark buttons show their pressed state through the primary button variant.
- `disabled` and `readonly` both set `contenteditable="false"` and `aria-readonly`.

## Notes

- Editing uses `document.execCommand`. It is formally deprecated but remains the only broadly
  supported way to drive a `contenteditable` surface; it is confined to `uc-editor.ts` so it can be
  replaced without touching formats or consumers.
- Pasted content is re-inserted through the sanitizer rather than trusted as-is.

## Storybook

See the component stories in `uc-editor/uc-editor.stories.ts`.
