import type { UcEditorCommand, UcEditorFormat } from '../uc-editor-format';
import { sanitizeEditorHtml } from '../uc-editor-sanitizer';

const SUPPORTED: UcEditorCommand[] = ['paragraph', 'bulletList', 'clearFormatting', 'undo', 'redo'];

/**
 * A third format defined entirely through the public interface: a plain text
 * document where every block becomes a line and no inline marks survive.
 */
export const PLAIN_TEXT_FORMAT: UcEditorFormat = {
  id: 'text',
  label: 'Plain text',
  mimeType: 'text/plain',
  fileExtensions: ['.txt'],
  supports: (command) => SUPPORTED.includes(command),
  toEditorHtml: (source) =>
    sanitizeEditorHtml(
      source
        .split('\n')
        .map((line) => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;') || '<br>'}</p>`)
        .join(''),
    ),
  fromEditorHtml: (html) => {
    const container = document.createElement('div');

    container.innerHTML = sanitizeEditorHtml(html);

    return [...container.children]
      .map((child) => child.textContent?.trim() ?? '')
      .join('\n')
      .trim();
  },
};
