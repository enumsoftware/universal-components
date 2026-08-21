import { UC_EDITOR_COMMAND_OPTIONS, UcEditorCommand, UcEditorFormat } from './uc-editor-format';
import { parseSanitizedHtml, sanitizeEditorHtml } from './uc-editor-sanitizer';

const BLOCK_TAGS = new Set([
  'BLOCKQUOTE',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HR',
  'LI',
  'OL',
  'P',
  'PRE',
  'UL',
]);

const VOID_TAGS = new Set(['BR', 'HR', 'IMG']);

/**
 * HTML documents. Both directions are near-identity: the source text already is the editing DOM, so
 * the format only sanitizes on the way in and re-indents block structure on the way out.
 */
export class UcHtmlEditorFormat implements UcEditorFormat {
  readonly id = 'html';
  readonly label = 'HTML';
  readonly mimeType = 'text/html';
  readonly fileExtensions = ['.html', '.htm'] as const;

  supports(command: UcEditorCommand): boolean {
    return UC_EDITOR_COMMAND_OPTIONS.includes(command);
  }

  toEditorHtml(source: string): string {
    return sanitizeEditorHtml(source);
  }

  fromEditorHtml(html: string): string {
    if (typeof document === 'undefined') {
      return '';
    }

    return printChildren(parseSanitizedHtml(html), 0).trim();
  }
}

function printChildren(parent: ParentNode, depth: number): string {
  const lines: string[] = [];

  for (const child of parent.childNodes) {
    const printed = printNode(child, depth);
    if (printed) {
      lines.push(printed);
    }
  }

  return lines.join('\n');
}

function printNode(node: Node, depth: number): string {
  const indent = '  '.repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? '').trim();
    return text ? indent + text : '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const openTag = `<${tag}${printAttributes(element)}>`;

  if (VOID_TAGS.has(element.tagName)) {
    return indent + openTag;
  }

  if (!BLOCK_TAGS.has(element.tagName) || !hasBlockChildren(element)) {
    // `PRE` keeps its exact whitespace, everything else is safe to trim onto a single line.
    const inner = element.tagName === 'PRE' ? element.innerHTML : element.innerHTML.trim();
    return `${indent}${openTag}${inner}</${tag}>`;
  }

  return [`${indent}${openTag}`, printChildren(element, depth + 1), `${indent}</${tag}>`].join('\n');
}

function hasBlockChildren(element: HTMLElement): boolean {
  return [...element.children].some((child) => BLOCK_TAGS.has(child.tagName));
}

function printAttributes(element: Element): string {
  return [...element.attributes]
    .map((attribute) => ` ${attribute.name}="${attribute.value.replace(/"/g, '&quot;')}"`)
    .join('');
}
