import { UcEditorCommand, UcEditorFormat } from './uc-editor-format';
import { sanitizeEditorHtml } from './uc-editor-sanitizer';
import { markdownToHtml } from './uc-markdown-parser';
import { htmlToMarkdown } from './uc-markdown-serializer';

/** Commands Markdown has no syntax for, so the toolbar hides them. */
const UNSUPPORTED_COMMANDS: ReadonlySet<UcEditorCommand> = new Set(['underline']);

/**
 * Markdown documents. The source text is parsed into HTML for editing and serialized back to
 * Markdown on every change, so the stored value is always Markdown rather than HTML.
 */
export class UcMarkdownEditorFormat implements UcEditorFormat {
  readonly id = 'markdown';
  readonly label = 'Markdown';
  readonly mimeType = 'text/markdown';
  readonly fileExtensions = ['.md', '.markdown'] as const;

  supports(command: UcEditorCommand): boolean {
    return !UNSUPPORTED_COMMANDS.has(command);
  }

  toEditorHtml(source: string): string {
    return sanitizeEditorHtml(markdownToHtml(source));
  }

  fromEditorHtml(html: string): string {
    return htmlToMarkdown(html);
  }
}
