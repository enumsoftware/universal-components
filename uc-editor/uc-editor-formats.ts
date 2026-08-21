import { UcEditorFormat } from './uc-editor-format';
import { UcHtmlEditorFormat } from './uc-html-editor-format';
import { UcMarkdownEditorFormat } from './uc-markdown-editor-format';

/** Shared instances: formats are stateless, so a single instance per format is enough. */
export const UC_EDITOR_HTML_FORMAT: UcEditorFormat = new UcHtmlEditorFormat();
export const UC_EDITOR_MARKDOWN_FORMAT: UcEditorFormat = new UcMarkdownEditorFormat();

/** Built-in format ids, accepted by `uc-editor` as a shorthand for the instances above. */
export type UcEditorFormatId = 'html' | 'markdown';

/** What the `format` input accepts: a built-in id, or any custom `UcEditorFormat` implementation. */
export type UcEditorFormatInput = UcEditorFormatId | UcEditorFormat;

export function resolveUcEditorFormat(format: UcEditorFormatInput): UcEditorFormat {
  if (typeof format !== 'string') {
    return format;
  }

  return format === 'markdown' ? UC_EDITOR_MARKDOWN_FORMAT : UC_EDITOR_HTML_FORMAT;
}

/** Pick a format by file name, for example when opening a dropped `.md` file. */
export function ucEditorFormatForFileName(
  fileName: string,
  formats: readonly UcEditorFormat[] = [UC_EDITOR_HTML_FORMAT, UC_EDITOR_MARKDOWN_FORMAT],
): UcEditorFormat | null {
  const lowerCaseName = fileName.toLowerCase();

  return (
    formats.find((format) =>
      format.fileExtensions.some((extension) => lowerCaseName.endsWith(extension)),
    ) ?? null
  );
}
