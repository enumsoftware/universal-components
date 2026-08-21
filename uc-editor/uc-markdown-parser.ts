/**
 * Minimal CommonMark-flavoured Markdown to HTML converter.
 *
 * Deliberately scoped to what the editor toolbar can produce and round-trip: headings, paragraphs,
 * hard breaks, emphasis, inline code, links, images, lists (including nesting), blockquotes, fenced
 * code and thematic breaks. Anything else is passed through as escaped text rather than guessed at.
 */

const HEADING_PATTERN = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})\s*([\w+-]*)\s*$/;
const RULE_PATTERN = /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/;
const QUOTE_PATTERN = /^ {0,3}>[ \t]?(.*)$/;
const LIST_ITEM_PATTERN = /^([ \t]*)([-*+]|\d{1,9}[.)])[ \t]+(.*)$/;

/** Private use area markers, so placeholders can never collide with document text. */
const PLACEHOLDER_OPEN = '\uE000';
const PLACEHOLDER_CLOSE = '\uE001';

export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  return parseBlocks(lines);
}

function parseBlocks(lines: readonly string[]): string {
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index++;
      continue;
    }

    const fence = FENCE_PATTERN.exec(line);
    if (fence) {
      const result = parseFencedCode(lines, index, fence[1], fence[2]);
      blocks.push(result.html);
      index = result.next;
      continue;
    }

    if (RULE_PATTERN.test(line)) {
      blocks.push('<hr>');
      index++;
      continue;
    }

    const heading = HEADING_PATTERN.exec(line);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${inlineToHtml(heading[2])}</h${level}>`);
      index++;
      continue;
    }

    if (QUOTE_PATTERN.test(line)) {
      const result = parseQuote(lines, index);
      blocks.push(result.html);
      index = result.next;
      continue;
    }

    if (LIST_ITEM_PATTERN.test(line)) {
      const result = parseList(lines, index, indentWidth(LIST_ITEM_PATTERN.exec(line)![1]));
      blocks.push(result.html);
      index = result.next;
      continue;
    }

    const result = parseParagraph(lines, index);
    blocks.push(result.html);
    index = result.next;
  }

  return blocks.join('');
}

function parseFencedCode(
  lines: readonly string[],
  start: number,
  fence: string,
  language: string,
): { html: string; next: number } {
  const closing = new RegExp(`^ {0,3}${fence[0] === '`' ? '`' : '~'}{${fence.length},}\\s*$`);
  const body: string[] = [];
  let index = start + 1;

  while (index < lines.length && !closing.test(lines[index])) {
    body.push(lines[index]);
    index++;
  }

  const languageClass = language ? ` class="language-${escapeHtml(language)}"` : '';
  const html = `<pre><code${languageClass}>${escapeHtml(body.join('\n'))}</code></pre>`;

  return { html, next: index < lines.length ? index + 1 : index };
}

function parseQuote(lines: readonly string[], start: number): { html: string; next: number } {
  const body: string[] = [];
  let index = start;

  while (index < lines.length) {
    const quoted = QUOTE_PATTERN.exec(lines[index]);
    if (quoted) {
      body.push(quoted[1]);
      index++;
      continue;
    }

    // A blank line, or any other block start, ends the quote.
    if (!lines[index].trim() || startsBlock(lines[index])) {
      break;
    }

    body.push(lines[index].trim());
    index++;
  }

  return { html: `<blockquote>${parseBlocks(body)}</blockquote>`, next: index };
}

function parseList(
  lines: readonly string[],
  start: number,
  indent: number,
): { html: string; next: number } {
  const first = LIST_ITEM_PATTERN.exec(lines[start])!;
  const ordered = /\d/.test(first[2]);
  const items: string[] = [];
  let index = start;

  while (index < lines.length) {
    const item = LIST_ITEM_PATTERN.exec(lines[index]);
    if (!item) {
      break;
    }

    const itemIndent = indentWidth(item[1]);
    if (itemIndent < indent || /\d/.test(item[2]) !== ordered) {
      break;
    }

    if (itemIndent > indent) {
      // A deeper item without a parent on this level: treat it as part of this list.
      const nested = parseList(lines, index, itemIndent);
      items.push(`<li>${nested.html}</li>`);
      index = nested.next;
      continue;
    }

    const content = [item[3]];
    let nested = '';
    index++;

    while (index < lines.length) {
      const continuation = LIST_ITEM_PATTERN.exec(lines[index]);

      if (continuation && indentWidth(continuation[1]) > itemIndent) {
        const child = parseList(lines, index, indentWidth(continuation[1]));
        nested += child.html;
        index = child.next;
        continue;
      }

      if (continuation || !lines[index].trim() || startsBlock(lines[index])) {
        break;
      }

      content.push(lines[index].trim());
      index++;
    }

    items.push(`<li>${inlineToHtml(content.join('\n'))}${nested}</li>`);
  }

  const tag = ordered ? 'ol' : 'ul';
  const startAttribute = ordered ? orderedStartAttribute(first[2]) : '';

  return { html: `<${tag}${startAttribute}>${items.join('')}</${tag}>`, next: index };
}

function parseParagraph(lines: readonly string[], start: number): { html: string; next: number } {
  const body: string[] = [];
  let index = start;

  while (index < lines.length && lines[index].trim() && !startsBlock(lines[index], index > start)) {
    body.push(lines[index]);
    index++;
  }

  return { html: `<p>${inlineToHtml(body.join('\n'))}</p>`, next: index };
}

function startsBlock(line: string, includeParagraphInterrupters = true): boolean {
  if (FENCE_PATTERN.test(line) || RULE_PATTERN.test(line) || HEADING_PATTERN.test(line)) {
    return true;
  }

  if (!includeParagraphInterrupters) {
    return false;
  }

  return QUOTE_PATTERN.test(line) || LIST_ITEM_PATTERN.test(line);
}

function indentWidth(indent: string): number {
  return indent.replace(/\t/g, '    ').length;
}

function orderedStartAttribute(marker: string): string {
  const start = Number.parseInt(marker, 10);
  return Number.isFinite(start) && start !== 1 ? ` start="${start}"` : '';
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineToHtml(text: string): string {
  const placeholders: string[] = [];
  const store = (value: string): string =>
    `${PLACEHOLDER_OPEN}${placeholders.push(value) - 1}${PLACEHOLDER_CLOSE}`;

  let result = text.replace(
    /(`+)([\s\S]*?)\1/g,
    (_match, _ticks: string, code: string) => store(`<code>${escapeHtml(code.trim())}</code>`),
  );

  result = result.replace(/\\([\\`*_{}[\]()#+\-.!~>])/g, (_match, character: string) =>
    store(escapeHtml(character)),
  );

  result = escapeHtml(result);

  result = result.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (match, alt: string, url: string, title?: string) => {
      const href = safeUrl(url);
      if (!href) {
        return match;
      }
      const titleAttribute = title ? ` title="${title}"` : '';
      return `<img src="${href}" alt="${alt}"${titleAttribute}>`;
    },
  );

  result = result.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
    (match, label: string, url: string, title?: string) => {
      const href = safeUrl(url);
      if (!href) {
        return match;
      }
      const titleAttribute = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttribute}>${label}</a>`;
    },
  );

  result = result
    .replace(/~~(?=\S)([\s\S]*?\S)~~/g, '<s>$1</s>')
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>')
    .replace(/__(?=\S)([\s\S]*?\S)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*(?=\S)([\s\S]*?\S)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_(?=\S)([\s\S]*?\S)_(?!_)/g, '$1<em>$2</em>');

  result = result.replace(/ {2,}\n/g, '<br>').replace(/\n/g, ' ');

  return result.replace(
    new RegExp(`${PLACEHOLDER_OPEN}(\\d+)${PLACEHOLDER_CLOSE}`, 'g'),
    (_match, index: string) => placeholders[Number(index)] ?? '',
  );
}

function safeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed || /^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    const allowed = /^(?:https?:|mailto:|tel:|data:image\/(?:png|jpe?g|gif|webp|svg\+xml);)/i;
    if (!allowed.test(trimmed)) {
      return null;
    }
  }

  return trimmed.replace(/"/g, '%22');
}
