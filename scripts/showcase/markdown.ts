/**
 * Compiles showcase `docs` markdown to HTML at build time.
 *
 * Doing it here rather than in the browser keeps every markdown parser out of
 * the shipped bundle - the workbench only ever receives finished HTML, which it
 * renders inside `.uc-content` so the library's own prose styles apply.
 */
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(source: string): string {
  const trimmed = source.trim();

  return trimmed === '' ? '' : (marked.parse(trimmed) as string);
}
