/**
 * Editing surface contract shared by every document format the editor can open.
 *
 * The editor itself only ever manipulates an HTML DOM: a format is responsible for turning the
 * stored source text into that DOM (`toEditorHtml`) and back again (`fromEditorHtml`), plus telling
 * the toolbar which commands the format can actually represent. Supporting a new format means
 * implementing this interface and nothing else.
 */

export const UC_EDITOR_COMMAND_OPTIONS = [
  'paragraph',
  'heading1',
  'heading2',
  'heading3',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'inlineCode',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'link',
  'image',
  'horizontalRule',
  'clearFormatting',
  'undo',
  'redo',
] as const;

export type UcEditorCommand = (typeof UC_EDITOR_COMMAND_OPTIONS)[number];

/**
 * How a command behaves, which decides how the toolbar renders it and how its active state is
 * resolved from the current selection.
 *
 * - `block` commands change the block the caret sits in and are mutually exclusive.
 * - `list` commands wrap blocks into a list.
 * - `inline` commands toggle a mark on the selected text.
 * - `insert` commands drop new content at the caret.
 * - `action` commands are stateless one-shot operations.
 */
export type UcEditorCommandKind = 'block' | 'list' | 'inline' | 'insert' | 'action';

export interface UcEditorCommandDescriptor {
  readonly command: UcEditorCommand;
  readonly kind: UcEditorCommandKind;
  /** Accessible name, also used as the button tooltip. */
  readonly label: string;
  /** Phosphor icon name, without the `ph-` prefix. */
  readonly icon: string;
  /** Short text shown instead of an icon in the block-type toggle. */
  readonly shortLabel?: string;
}

export const UC_EDITOR_COMMAND_DESCRIPTORS: Readonly<
  Record<UcEditorCommand, UcEditorCommandDescriptor>
> = {
  paragraph: {
    command: 'paragraph',
    kind: 'block',
    label: 'Paragraph',
    icon: 'paragraph',
    shortLabel: 'P',
  },
  heading1: {
    command: 'heading1',
    kind: 'block',
    label: 'Heading 1',
    icon: 'text-h-one',
    shortLabel: 'H1',
  },
  heading2: {
    command: 'heading2',
    kind: 'block',
    label: 'Heading 2',
    icon: 'text-h-two',
    shortLabel: 'H2',
  },
  heading3: {
    command: 'heading3',
    kind: 'block',
    label: 'Heading 3',
    icon: 'text-h-three',
    shortLabel: 'H3',
  },
  bold: { command: 'bold', kind: 'inline', label: 'Bold', icon: 'text-b' },
  italic: { command: 'italic', kind: 'inline', label: 'Italic', icon: 'text-italic' },
  underline: { command: 'underline', kind: 'inline', label: 'Underline', icon: 'text-underline' },
  strikethrough: {
    command: 'strikethrough',
    kind: 'inline',
    label: 'Strikethrough',
    icon: 'text-strikethrough',
  },
  inlineCode: { command: 'inlineCode', kind: 'inline', label: 'Inline code', icon: 'code' },
  bulletList: { command: 'bulletList', kind: 'list', label: 'Bulleted list', icon: 'list-bullets' },
  orderedList: {
    command: 'orderedList',
    kind: 'list',
    label: 'Numbered list',
    icon: 'list-numbers',
  },
  blockquote: { command: 'blockquote', kind: 'block', label: 'Quote', icon: 'quotes' },
  codeBlock: { command: 'codeBlock', kind: 'block', label: 'Code block', icon: 'code-block' },
  link: { command: 'link', kind: 'insert', label: 'Link', icon: 'link-simple' },
  image: { command: 'image', kind: 'insert', label: 'Image', icon: 'image' },
  horizontalRule: {
    command: 'horizontalRule',
    kind: 'insert',
    label: 'Divider',
    icon: 'minus',
  },
  clearFormatting: {
    command: 'clearFormatting',
    kind: 'action',
    label: 'Clear formatting',
    icon: 'eraser',
  },
  undo: { command: 'undo', kind: 'action', label: 'Undo', icon: 'arrow-counter-clockwise' },
  redo: { command: 'redo', kind: 'action', label: 'Redo', icon: 'arrow-clockwise' },
};

export interface UcEditorFormat {
  /** Stable identifier, for example `html` or `markdown`. */
  readonly id: string;
  /** Human readable name shown in the editor status row. */
  readonly label: string;
  /** MIME type used when the value is written to a file or the clipboard. */
  readonly mimeType: string;
  /** File extensions this format owns, leading dot included. */
  readonly fileExtensions: readonly string[];
  /** Whether the toolbar should offer `command` for this format. */
  supports(command: UcEditorCommand): boolean;
  /** Convert stored source text into the HTML the editable surface renders. */
  toEditorHtml(source: string): string;
  /** Convert the editable surface HTML back into stored source text. */
  fromEditorHtml(html: string): string;
}
