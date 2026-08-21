/**
 * HTML to Markdown serializer for the editable surface.
 *
 * Mirrors `markdownToHtml`: everything the parser can produce round-trips back to comparable
 * Markdown. Elements Markdown cannot express (for example `<u>`) keep their text and lose the mark.
 */

import { parseSanitizedHtml } from './uc-editor-sanitizer';

const BLOCK_TAGS = new Set([
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'UL',
  'OL',
  'BLOCKQUOTE',
  'PRE',
  'HR',
]);

export function htmlToMarkdown(html: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const root = parseSanitizedHtml(html);
  return serializeBlocks(root, '')
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function serializeBlocks(parent: ParentNode, indent: string): string[] {
  const blocks: string[] = [];
  let inlineRun: Node[] = [];

  const flushInline = (): void => {
    if (!inlineRun.length) {
      return;
    }

    const text = inlineRun.map((node) => inlineToMarkdown(node)).join('');
    inlineRun = [];

    const trimmed = text.trim();
    if (trimmed) {
      blocks.push(indent + escapeBlockStart(trimmed));
    }
  };

  for (const child of parent.childNodes) {
    if (isBlockElement(child)) {
      flushInline();
      const block = blockToMarkdown(child as HTMLElement, indent);
      if (block) {
        blocks.push(block);
      }
      continue;
    }

    inlineRun.push(child);
  }

  flushInline();

  return blocks;
}

function isBlockElement(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((node as Element).tagName);
}

function blockToMarkdown(element: HTMLElement, indent: string): string {
  const tag = element.tagName;

  if (tag === 'HR') {
    return `${indent}---`;
  }

  if (tag === 'PRE') {
    return fencedCodeToMarkdown(element, indent);
  }

  if (tag === 'UL' || tag === 'OL') {
    return listToMarkdown(element, indent);
  }

  if (tag === 'BLOCKQUOTE') {
    const inner = serializeBlocks(element, '').join('\n\n');
    if (!inner.trim()) {
      return '';
    }
    return inner
      .split('\n')
      .map((line) => `${indent}>${line ? ` ${line}` : ''}`)
      .join('\n');
  }

  const headingLevel = /^H([1-6])$/.exec(tag);
  if (headingLevel) {
    const text = inlineChildrenToMarkdown(element).trim();
    return text ? `${indent}${'#'.repeat(Number(headingLevel[1]))} ${text}` : '';
  }

  // `P`, `DIV`, and anything else block-like. A wrapper that only holds other blocks is flattened
  // instead of being forced into a paragraph, which is what contenteditable tends to produce.
  if (hasBlockChildren(element)) {
    return serializeBlocks(element, indent).join('\n\n');
  }

  const text = inlineChildrenToMarkdown(element).trim();
  return text ? indent + escapeBlockStart(text) : '';
}

function hasBlockChildren(element: HTMLElement): boolean {
  return [...element.childNodes].some((child) => isBlockElement(child));
}

function fencedCodeToMarkdown(element: HTMLElement, indent: string): string {
  const code = element.querySelector('code');
  const language = /language-([\w+-]+)/.exec(code?.className ?? '')?.[1] ?? '';
  const body = (code?.textContent ?? element.textContent ?? '').replace(/\n$/, '');
  const fence = body.includes('```') ? '~~~' : '```';
  const lines = body.split('\n').map((line) => indent + line);

  return [`${indent}${fence}${language}`, ...lines, `${indent}${fence}`].join('\n');
}

function listToMarkdown(list: HTMLElement, indent: string): string {
  const ordered = list.tagName === 'OL';
  const startAttribute = Number.parseInt(list.getAttribute('start') ?? '1', 10);
  let counter = Number.isFinite(startAttribute) ? startAttribute : 1;

  const lines: string[] = [];

  for (const item of [...list.children]) {
    if (item.tagName !== 'LI') {
      continue;
    }

    const marker = ordered ? `${counter++}. ` : '- ';
    const childIndent = `${indent}${' '.repeat(marker.length)}`;
    const nestedLists = [...item.children].filter(
      (child) => child.tagName === 'UL' || child.tagName === 'OL',
    );

    const inlineNodes = [...item.childNodes].filter((node) => !nestedLists.includes(node as Element));
    const text = inlineNodes
      .map((node) => (isBlockElement(node) ? blockToMarkdown(node as HTMLElement, '') : inlineToMarkdown(node)))
      .join('')
      .trim();

    lines.push(`${indent}${marker}${escapeBlockStart(text)}`);

    for (const nested of nestedLists) {
      lines.push(listToMarkdown(nested as HTMLElement, childIndent));
    }
  }

  return lines.join('\n');
}

function inlineChildrenToMarkdown(element: Element): string {
  return [...element.childNodes].map((node) => inlineToMarkdown(node)).join('');
}

function inlineToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeMarkdown((node.textContent ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' '));
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as HTMLElement;

  switch (element.tagName) {
    case 'BR':
      return '  \n';
    case 'IMG': {
      const alt = element.getAttribute('alt') ?? '';
      const src = element.getAttribute('src') ?? '';
      return src ? `![${alt}](${src})` : '';
    }
    case 'A': {
      const label = inlineChildrenToMarkdown(element);
      const href = element.getAttribute('href');
      return href ? `[${label || href}](${href})` : label;
    }
    case 'CODE': {
      const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (!text) {
        return '';
      }
      const fence = '`'.repeat(longestBacktickRun(text) + 1);
      const padding = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
      return `${fence}${padding}${text}${padding}${fence}`;
    }
    case 'STRONG':
    case 'B':
      return wrapMark(inlineChildrenToMarkdown(element), '**');
    case 'EM':
    case 'I':
      return wrapMark(inlineChildrenToMarkdown(element), '*');
    case 'S':
    case 'DEL':
    case 'STRIKE':
      return wrapMark(inlineChildrenToMarkdown(element), '~~');
    default:
      // `U`, `SPAN`, and any other inline wrapper Markdown cannot express.
      return inlineChildrenToMarkdown(element);
  }
}

function wrapMark(content: string, marker: string): string {
  const trimmed = content.trim();
  if (!trimmed) {
    return content;
  }

  const leading = content.startsWith(' ') ? ' ' : '';
  const trailing = content.endsWith(' ') ? ' ' : '';

  return `${leading}${marker}${trimmed}${marker}${trailing}`;
}

function longestBacktickRun(text: string): number {
  return (text.match(/`+/g) ?? []).reduce((longest, run) => Math.max(longest, run.length), 0);
}

function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_[\]])/g, '\\$1');
}

/** Escape markers that would turn the start of a block into a different block type. */
function escapeBlockStart(text: string): string {
  return text.replace(/^(#{1,6}\s|>|[-+*]\s|\d{1,9}[.)]\s)/, '\\$1');
}
