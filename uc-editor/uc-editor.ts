import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { UcButton } from '../uc-button/uc-button';
import { UcButtonToggle } from '../uc-button-toggle/uc-button-toggle';
import { UcButtonToggleItem } from '../uc-button-toggle/uc-button-toggle-item';
import { UcDivider } from '../uc-divider/uc-divider';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';
import { UcInput } from '../uc-input/uc-input';
import { SelectOption, UcSelect } from '../uc-select/uc-select';
import {
  UC_EDITOR_COMMAND_DESCRIPTORS,
  UC_EDITOR_COMMAND_OPTIONS,
  UcEditorCommand,
  UcEditorCommandDescriptor,
  UcEditorFormat,
} from './uc-editor-format';
import { UcEditorFormatInput, resolveUcEditorFormat } from './uc-editor-formats';
import { isSafeEditorUrl, sanitizeEditorHtml } from './uc-editor-sanitizer';

export const UC_EDITOR_VIEW_OPTIONS = ['wysiwyg', 'source'] as const;
export type UcEditorView = (typeof UC_EDITOR_VIEW_OPTIONS)[number];

/** Block types offered by the toolbar's block-type select, in display order. */
const BLOCK_TYPE_COMMANDS: readonly UcEditorCommand[] = [
  'paragraph',
  'heading1',
  'heading2',
  'heading3',
];

const BLOCK_TAG_BY_COMMAND: Readonly<Partial<Record<UcEditorCommand, string>>> = {
  paragraph: 'P',
  heading1: 'H1',
  heading2: 'H2',
  heading3: 'H3',
  blockquote: 'BLOCKQUOTE',
  codeBlock: 'PRE',
};

const COMMAND_BY_BLOCK_TAG: Readonly<Record<string, UcEditorCommand>> = {
  P: 'paragraph',
  DIV: 'paragraph',
  H1: 'heading1',
  H2: 'heading2',
  H3: 'heading3',
  BLOCKQUOTE: 'blockquote',
  PRE: 'codeBlock',
};

/** Seed markup so typing into an empty document starts inside a paragraph. */
const EMPTY_DOCUMENT_HTML = '<p><br></p>';

type UcEditorInsertTarget = 'link' | 'image';

/**
 * A small WYSIWYG editor for document formats.
 *
 * The component owns the editing surface, the toolbar and the selection state; everything that is
 * specific to a document format lives behind {@link UcEditorFormat}. `format` accepts the built-in
 * `'html'` and `'markdown'` ids or any custom implementation of that interface.
 */
@Component({
  selector: 'uc-editor',
  imports: [
    UcButton,
    UcButtonToggle,
    UcButtonToggleItem,
    UcDivider,
    UcIconButton,
    UcInput,
    UcSelect,
  ],
  templateUrl: './uc-editor.html',
  styleUrl: './uc-editor.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcEditor implements FormValueControl<string> {
  readonly id = input.required<string>();
  readonly label = input<string>('');
  readonly hideLabel = input<boolean>(false);
  readonly placeholder = input<string>('Start writing…');

  /** Built-in format id, or a custom `UcEditorFormat` implementation. */
  readonly format = input<UcEditorFormatInput>('html');

  /** Restrict the toolbar to these commands. Defaults to everything the format supports. */
  readonly commands = input<readonly UcEditorCommand[] | null>(null);

  readonly showSourceToggle = input<boolean>(true);
  readonly showStatusBar = input<boolean>(true);

  /** Document source text, in the active format. */
  value = model<string>('');
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  touched = model<boolean>(false);
  view = model<UcEditorView>('wysiwyg');

  readonly showErrorState = computed(() => this.invalid() && this.touched());
  readonly activeFormat = computed<UcEditorFormat>(() => resolveUcEditorFormat(this.format()));
  readonly isReadOnly = computed(() => this.disabled() || this.readonly());
  readonly isEmpty = computed(() => !this.value().trim());
  readonly labelId = computed(() => `${this.id()}-label`);
  /** Only reference the visible label element while it is actually rendered. */
  readonly labelledBy = computed(() => (this.label() && !this.hideLabel() ? this.labelId() : null));
  readonly surfaceAriaLabel = computed(() => {
    if (this.label()) {
      return this.hideLabel() ? this.label() : null;
    }
    return this.placeholder().trim() || `${this.activeFormat().label} editor`;
  });
  readonly sourceAriaLabel = computed(() => {
    if (this.label()) {
      return this.hideLabel() ? `${this.label()} source` : null;
    }
    return `${this.activeFormat().label} source`;
  });

  readonly activeCommands = signal<ReadonlySet<UcEditorCommand>>(new Set());
  readonly activeBlock = signal<UcEditorCommand | null>('paragraph');
  readonly insertTarget = signal<UcEditorInsertTarget | null>(null);
  readonly insertUrl = signal<string>('');
  readonly insertLabel = signal<string>('');
  readonly insertError = signal<string>('');

  private readonly surfaceRef = viewChild<ElementRef<HTMLElement>>('surface');

  private readonly visibleCommands = computed<readonly UcEditorCommandDescriptor[]>(() => {
    const format = this.activeFormat();
    const requested = this.commands() ?? UC_EDITOR_COMMAND_OPTIONS;

    return requested
      .filter((command) => format.supports(command))
      .map((command) => UC_EDITOR_COMMAND_DESCRIPTORS[command]);
  });

  readonly blockTypeCommands = computed(() =>
    this.visibleCommands().filter((descriptor) =>
      BLOCK_TYPE_COMMANDS.includes(descriptor.command),
    ),
  );

  /** Block-type dropdown options; the full label reads better than the toolbar's short one. */
  readonly blockTypeOptions = computed<SelectOption<UcEditorCommand>[]>(() =>
    this.blockTypeCommands().map((descriptor) => ({
      value: descriptor.command,
      label: descriptor.label,
    })),
  );

  readonly inlineCommands = computed(() =>
    this.visibleCommands().filter((descriptor) => descriptor.kind === 'inline'),
  );

  /** Lists plus the block types that are not part of the block-type select. */
  readonly structureCommands = computed(() =>
    this.visibleCommands().filter(
      (descriptor) =>
        descriptor.kind === 'list' ||
        (descriptor.kind === 'block' && !BLOCK_TYPE_COMMANDS.includes(descriptor.command)),
    ),
  );

  readonly insertCommands = computed(() =>
    this.visibleCommands().filter((descriptor) => descriptor.kind === 'insert'),
  );

  readonly actionCommands = computed(() =>
    this.visibleCommands().filter((descriptor) => descriptor.kind === 'action'),
  );

  readonly characterCount = computed(() => this.value().length);

  private renderedValue: string | null = null;
  private renderedSurface: HTMLElement | null = null;
  private renderedFormat: UcEditorFormat | null = null;
  private savedRange: Range | null = null;
  private blockSelectRange: Range | null = null;

  constructor() {
    afterNextRender(() => {
      // Keep the browser emitting semantic tags (`<b>`, `<i>`) instead of inline styles, so both
      // formats have something meaningful to serialize.
      this.execCommand('styleWithCSS', 'false');
      this.execCommand('defaultParagraphSeparator', 'p');
    });

    effect(() => {
      const format = this.activeFormat();
      const value = this.value();
      const surface = this.view() === 'wysiwyg' ? (this.surfaceRef()?.nativeElement ?? null) : null;

      if (!surface) {
        return;
      }

      const isUpToDate =
        surface === this.renderedSurface &&
        format === this.renderedFormat &&
        value === this.renderedValue;

      if (isUpToDate) {
        return;
      }

      const html = format.toEditorHtml(value);
      surface.innerHTML = html.trim() ? html : EMPTY_DOCUMENT_HTML;
      this.renderedSurface = surface;
      this.renderedFormat = format;
      this.renderedValue = value;
    });
  }

  isActive(command: UcEditorCommand): boolean {
    return this.activeCommands().has(command);
  }

  /** Variant used for toolbar icon buttons, which carry their pressed state through the variant. */
  toolbarVariant(command: UcEditorCommand): 'primary' | 'secondary' {
    return this.isActive(command) ? 'primary' : 'secondary';
  }

  /**
   * The block-type dropdown is the one toolbar control that needs focus of its own, so it opts
   * out of the toolbar's focus guard and stashes the document selection to restore afterwards.
   */
  onBlockSelectMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.blockSelectRange = this.currentRange()?.cloneRange() ?? null;
  }

  onBlockSelect(command: UcEditorCommand | null): void {
    if (!command) {
      return;
    }

    const surface = this.surfaceRef()?.nativeElement;
    if (surface && this.blockSelectRange) {
      surface.focus();
      const selection = document.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(this.blockSelectRange);
    }

    this.blockSelectRange = null;
    this.runCommand(command);
  }

  setView(view: UcEditorView): void {
    if (view === this.view()) {
      return;
    }

    this.closeInsertPanel();
    this.view.set(view);
  }

  onSourceInput(source: string): void {
    this.renderedValue = null;
    this.value.set(source);
  }

  onSurfaceInput(): void {
    this.syncFromSurface();
    this.updateActiveState();
  }

  onSurfaceBlur(): void {
    this.touched.set(true);
  }

  /**
   * Toolbar buttons must not take focus: the surface selection is what every command operates on,
   * and some browsers collapse it when focus leaves the editable element.
   */
  onToolbarMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }

  onSelectionChange(): void {
    this.updateActiveState();
  }

  onPaste(event: ClipboardEvent): void {
    if (this.isReadOnly()) {
      return;
    }

    const html = event.clipboardData?.getData('text/html') ?? '';
    const text = event.clipboardData?.getData('text/plain') ?? '';
    event.preventDefault();

    if (html) {
      this.execCommand('insertHTML', sanitizeEditorHtml(html));
    } else if (text) {
      this.execCommand('insertText', text);
    }

    this.syncFromSurface();
    this.updateActiveState();
  }

  runCommand(command: UcEditorCommand): void {
    if (this.isReadOnly() || !this.activeFormat().supports(command)) {
      return;
    }

    const surface = this.surfaceRef()?.nativeElement;
    if (!surface) {
      return;
    }

    if (command === 'link' || command === 'image') {
      this.openInsertPanel(command);
      return;
    }

    surface.focus();

    switch (command) {
      case 'bold':
      case 'italic':
      case 'underline':
        this.execCommand(command);
        break;
      case 'strikethrough':
        this.execCommand('strikeThrough');
        break;
      case 'inlineCode':
        this.toggleInlineCode(surface);
        break;
      case 'bulletList':
        this.execCommand('insertUnorderedList');
        break;
      case 'orderedList':
        this.execCommand('insertOrderedList');
        break;
      case 'horizontalRule':
        this.execCommand('insertHorizontalRule');
        break;
      case 'clearFormatting':
        this.execCommand('removeFormat');
        this.execCommand('formatBlock', '<P>');
        break;
      case 'undo':
        this.execCommand('undo');
        break;
      case 'redo':
        this.execCommand('redo');
        break;
      default: {
        const tag = BLOCK_TAG_BY_COMMAND[command];
        if (tag) {
          this.applyBlock(command, tag);
        }
      }
    }

    this.syncFromSurface();
    this.updateActiveState();
  }

  openInsertPanel(target: UcEditorInsertTarget): void {
    if (target === 'link' && this.isActive('link')) {
      this.surfaceRef()?.nativeElement.focus();
      this.execCommand('unlink');
      this.syncFromSurface();
      this.updateActiveState();
      return;
    }

    // Clone: `getRangeAt` hands back the live selection range, which moves with the caret as soon
    // as focus lands in the panel inputs.
    this.savedRange = this.currentRange()?.cloneRange() ?? null;
    this.insertUrl.set('');
    this.insertLabel.set(this.savedRange?.toString() ?? '');
    this.insertError.set('');
    this.insertTarget.set(target);
  }

  closeInsertPanel(): void {
    this.insertTarget.set(null);
    this.savedRange = null;
    this.insertError.set('');
  }

  applyInsert(): void {
    const target = this.insertTarget();
    const surface = this.surfaceRef()?.nativeElement;
    const url = this.insertUrl().trim();

    if (!target || !surface) {
      return;
    }

    if (!isSafeEditorUrl(url)) {
      this.insertError.set('Enter a valid http(s), mailto, tel or relative URL.');
      return;
    }

    surface.focus();
    this.restoreRange();

    if (target === 'image') {
      this.execCommand('insertHTML', `<img src="${escapeAttribute(url)}" alt="${escapeAttribute(this.insertLabel())}">`);
    } else if (this.savedRange && !this.savedRange.collapsed) {
      this.execCommand('createLink', url);
    } else {
      const text = this.insertLabel().trim() || url;
      this.execCommand('insertHTML', `<a href="${escapeAttribute(url)}">${escapeText(text)}</a>`);
    }

    this.closeInsertPanel();
    this.syncFromSurface();
    this.updateActiveState();
  }

  private applyBlock(command: UcEditorCommand, tag: string): void {
    // Toggling the active block type off returns the block to a paragraph.
    const nextTag = this.activeCommands().has(command) && command !== 'paragraph' ? 'P' : tag;
    this.execCommand('formatBlock', `<${nextTag}>`);
  }

  private toggleInlineCode(surface: HTMLElement): void {
    const range = this.currentRange();
    if (!range) {
      return;
    }

    const existing = this.closestElementWithin(range.startContainer, 'CODE', surface);
    if (existing) {
      const parent = existing.parentNode;
      if (parent) {
        while (existing.firstChild) {
          parent.insertBefore(existing.firstChild, existing);
        }
        parent.removeChild(existing);
      }
      return;
    }

    if (range.collapsed) {
      return;
    }

    const code = document.createElement('code');
    try {
      range.surroundContents(code);
    } catch {
      // The selection crosses element boundaries, so move the contents manually instead.
      code.appendChild(range.extractContents());
      range.insertNode(code);
    }

    const selection = document.getSelection();
    if (selection) {
      const codeRange = document.createRange();
      codeRange.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(codeRange);
    }
  }

  private syncFromSurface(): void {
    const surface = this.surfaceRef()?.nativeElement;
    if (!surface) {
      return;
    }

    const format = this.activeFormat();
    const source = format.fromEditorHtml(surface.innerHTML);

    this.renderedSurface = surface;
    this.renderedFormat = format;
    this.renderedValue = source;
    this.value.set(source);
  }

  private updateActiveState(): void {
    const surface = this.surfaceRef()?.nativeElement;
    if (!surface) {
      return;
    }

    const active = new Set<UcEditorCommand>();

    if (this.queryState('bold')) {
      active.add('bold');
    }
    if (this.queryState('italic')) {
      active.add('italic');
    }
    if (this.queryState('underline')) {
      active.add('underline');
    }
    if (this.queryState('strikeThrough')) {
      active.add('strikethrough');
    }
    if (this.queryState('insertUnorderedList')) {
      active.add('bulletList');
    }
    if (this.queryState('insertOrderedList')) {
      active.add('orderedList');
    }

    const range = this.currentRange();
    const anchor = range && surface.contains(range.startContainer) ? range.startContainer : null;

    if (anchor) {
      if (this.closestElementWithin(anchor, 'CODE', surface)) {
        active.add('inlineCode');
      }
      if (this.closestElementWithin(anchor, 'A', surface)) {
        active.add('link');
      }

      const blockCommand = this.blockCommandAt(anchor, surface);
      if (blockCommand) {
        active.add(blockCommand);
      }

      this.activeBlock.set(
        blockCommand && BLOCK_TYPE_COMMANDS.includes(blockCommand) ? blockCommand : null,
      );
    }

    this.activeCommands.set(active);
  }

  private blockCommandAt(node: Node, surface: HTMLElement): UcEditorCommand | null {
    let current: Node | null = node;

    while (current && current !== surface) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const command = COMMAND_BY_BLOCK_TAG[(current as Element).tagName];
        if (command) {
          return command;
        }
      }
      current = current.parentNode;
    }

    return null;
  }

  private closestElementWithin(node: Node, tagName: string, surface: HTMLElement): Element | null {
    let current: Node | null = node;

    while (current && current !== surface) {
      if (current.nodeType === Node.ELEMENT_NODE && (current as Element).tagName === tagName) {
        return current as Element;
      }
      current = current.parentNode;
    }

    return null;
  }

  private currentRange(): Range | null {
    const selection = typeof document === 'undefined' ? null : document.getSelection();
    return selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }

  private restoreRange(): void {
    const selection = document.getSelection();
    if (!selection || !this.savedRange) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(this.savedRange);
  }

  private execCommand(command: string, value?: string): void {
    if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
      return;
    }

    try {
      document.execCommand(command, false, value);
    } catch {
      // Older engines throw for unsupported commands; the surface simply stays unchanged.
    }
  }

  private queryState(command: string): boolean {
    if (typeof document === 'undefined' || typeof document.queryCommandState !== 'function') {
      return false;
    }

    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
