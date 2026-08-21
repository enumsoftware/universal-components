/**
 * Allowlist sanitizer for the editable surface.
 *
 * The editor assigns HTML through `innerHTML` rather than an Angular binding, so Angular's own
 * sanitizer never sees this markup. Every string that reaches the surface, including values a
 * format produced from untrusted source text, goes through here first.
 */

const ALLOWED_TAGS = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CODE',
  'DEL',
  'DIV',
  'EM',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HR',
  'I',
  'IMG',
  'LI',
  'OL',
  'P',
  'PRE',
  'S',
  'SPAN',
  'STRIKE',
  'STRONG',
  'SUB',
  'SUP',
  'U',
  'UL',
]);

const ALLOWED_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
  A: ['href', 'title', 'target', 'rel'],
  IMG: ['src', 'alt', 'title', 'width', 'height'],
  CODE: ['class'],
  PRE: ['class'],
  OL: ['start'],
};

const URL_ATTRIBUTES = new Set(['href', 'src']);
const SAFE_URL_PATTERN = /^(?:https?:|mailto:|tel:|data:image\/(?:png|jpe?g|gif|webp|svg\+xml);|#|\/|\.\/|\.\.\/)/i;

/** Tags whose entire subtree is dropped rather than unwrapped. */
const DROPPED_SUBTREES = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META']);

export function isSafeEditorUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  // Reject control characters that can be used to smuggle a `javascript:` scheme past the check.
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) {
    return false;
  }

  return SAFE_URL_PATTERN.test(trimmed) || !/^[a-z][a-z0-9+.-]*:/i.test(trimmed);
}

/**
 * Strip everything outside the allowlist. Disallowed elements are unwrapped so their text survives,
 * except for script-like subtrees, which are removed entirely.
 */
export function sanitizeEditorHtml(html: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const container = document.createElement('div');
  container.innerHTML = html;
  sanitizeNode(container);
  return container.innerHTML;
}

/** Parse `html` into a detached, sanitized element the caller can walk. */
export function parseSanitizedHtml(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  sanitizeNode(container);
  return container;
}

function sanitizeNode(node: Element): void {
  for (const child of [...node.children]) {
    if (DROPPED_SUBTREES.has(child.tagName)) {
      child.remove();
      continue;
    }

    sanitizeNode(child);

    if (!ALLOWED_TAGS.has(child.tagName)) {
      unwrap(child);
      continue;
    }

    sanitizeAttributes(child);
  }
}

function sanitizeAttributes(element: Element): void {
  const allowed = ALLOWED_ATTRIBUTES[element.tagName] ?? [];

  for (const attribute of [...element.attributes]) {
    const name = attribute.name.toLowerCase();

    if (!allowed.includes(name)) {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (URL_ATTRIBUTES.has(name) && !isSafeEditorUrl(attribute.value)) {
      element.removeAttribute(attribute.name);
    }
  }

  if (element.tagName === 'A' && element.getAttribute('target') === '_blank') {
    element.setAttribute('rel', 'noopener noreferrer');
  }
}

function unwrap(element: Element): void {
  const parent = element.parentNode;
  if (!parent) {
    element.remove();
    return;
  }

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}
