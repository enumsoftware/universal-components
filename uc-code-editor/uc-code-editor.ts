import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import type * as Monaco from 'monaco-editor';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';
import { UcPill } from '../uc-pill/uc-pill';
import { loadMonaco } from './uc-code-editor-monaco-loader';
import { ucCodeEditorLanguageLabel } from './uc-code-editor-languages';

export type UcCodeEditorMode = 'edit' | 'preview';
export type UcCodeEditorTheme = 'auto' | 'light' | 'dark';

/** Theme names, set via `data-theme` on `<html>` elsewhere in this library, that read as dark. */
const DARK_THEME_NAMES = new Set(['dark', 'midnight']);

@Component({
  selector: 'uc-code-editor',
  imports: [CommonModule, FormsModule, UcIconButton, UcPill],
  templateUrl: './uc-code-editor.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-code-editor.css',
  host: {
    class: 'uc-code-editor-host',
  },
})
export class UcCodeEditor implements FormValueControl<string | null>, OnDestroy {
  private readonly editorHost = viewChild<ElementRef<HTMLElement>>('editorHost');

  // Input properties
  readonly id = input.required<string>();
  readonly label = input<string>('');
  /** Keeps the label available to assistive tech while removing it from the layout. */
  readonly hideLabel = input<boolean>(false);
  readonly language = input<string>('plaintext');
  /** Overrides the badge text; otherwise derived from `language` (e.g. `csharp` -> `C#`). */
  readonly languageLabel = input<string | null>(null);
  readonly height = input<string>('320px');
  readonly showLanguageBadge = input<boolean>(true);
  readonly showCopyButton = input<boolean>(true);
  /** Set by the consumer; there is no in-toolbar control for switching it. */
  readonly mode = input<UcCodeEditorMode>('edit');
  readonly minimap = input<boolean>(false);
  readonly wordWrap = input<boolean>(false);
  readonly fontSize = input<number>(13);
  /** `auto` follows this library's `data-theme` attribute, falling back to `prefers-color-scheme`. */
  readonly theme = input<UcCodeEditorTheme>('auto');
  /** Escape hatch merged into the editor's construction options last, so it can override any of the above. */
  readonly editorOptions = input<Monaco.editor.IStandaloneEditorConstructionOptions>({});

  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);

  // Model properties
  value = model<string | null>(null);
  touched = model<boolean>(false);

  // Internal state
  readonly loading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);
  readonly copied = signal<boolean>(false);
  private readonly darkModeActive = signal<boolean>(false);

  // Computed properties
  showErrorState = computed(() => this.invalid() && this.touched());
  readonly labelId = computed(() => `${this.id()}-label`);
  readonly isPreview = computed(() => this.mode() === 'preview');
  readonly isReadOnly = computed(() => this.disabled() || this.readonly() || this.isPreview());
  readonly resolvedLanguageLabel = computed(
    () => this.languageLabel() ?? ucCodeEditorLanguageLabel(this.language()),
  );
  readonly resolvedMonacoTheme = computed<'vs' | 'vs-dark'>(() => {
    const theme = this.theme();

    if (theme === 'light') {
      return 'vs';
    }

    if (theme === 'dark') {
      return 'vs-dark';
    }

    return this.darkModeActive() ? 'vs-dark' : 'vs';
  });

  private editor: Monaco.editor.IStandaloneCodeEditor | null = null;
  private monacoApi: typeof Monaco | null = null;
  private applyingExternalValue = false;
  private copiedTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private themeMutationObserver: MutationObserver | null = null;
  private darkMediaQuery: MediaQueryList | null = null;
  private readonly onDarkMediaChange = (): void => this.refreshDarkModeActive();

  constructor() {
    afterNextRender(() => {
      this.setUpThemeWatchers();
      void this.initEditor();
    });

    effect(() => {
      const readOnly = this.isReadOnly();
      this.editor?.updateOptions({ readOnly });
    });

    effect(() => {
      const language = this.language();
      const textModel = this.editor?.getModel();

      if (textModel && this.monacoApi) {
        this.monacoApi.editor.setModelLanguage(textModel, language);
      }
    });

    effect(() => {
      const wordWrap = this.wordWrap();
      this.editor?.updateOptions({ wordWrap: wordWrap ? 'on' : 'off' });
    });

    effect(() => {
      const enabled = this.minimap();
      this.editor?.updateOptions({ minimap: { enabled } });
    });

    effect(() => {
      const fontSize = this.fontSize();
      this.editor?.updateOptions({ fontSize });
    });

    effect(() => {
      const theme = this.resolvedMonacoTheme();
      this.monacoApi?.editor.setTheme(theme);
    });

    effect(() => {
      const label = this.label();
      this.editor?.updateOptions({ ariaLabel: label || 'Code editor' });
    });

    effect(() => {
      const nextValue = this.value() ?? '';
      const editor = this.editor;

      if (!editor || this.applyingExternalValue || editor.getValue() === nextValue) {
        return;
      }

      this.applyingExternalValue = true;
      const position = editor.getPosition();
      editor.setValue(nextValue);
      if (position) {
        editor.setPosition(position);
      }
      this.applyingExternalValue = false;
    });
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
    this.themeMutationObserver?.disconnect();
    this.darkMediaQuery?.removeEventListener('change', this.onDarkMediaChange);

    if (this.copiedTimeoutId) {
      clearTimeout(this.copiedTimeoutId);
    }
  }

  async copyToClipboard(): Promise<void> {
    const text = this.editor?.getValue() ?? this.value() ?? '';

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        this.copyWithExecCommand(text);
      }
    } catch {
      this.copyWithExecCommand(text);
    }

    this.flashCopied();
  }

  private copyWithExecCommand(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textarea);
    }
  }

  private flashCopied(): void {
    this.copied.set(true);

    if (this.copiedTimeoutId) {
      clearTimeout(this.copiedTimeoutId);
    }

    this.copiedTimeoutId = setTimeout(() => this.copied.set(false), 1500);
  }

  private setUpThemeWatchers(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    this.darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMediaQuery.addEventListener('change', this.onDarkMediaChange);

    this.themeMutationObserver = new MutationObserver(() => this.refreshDarkModeActive());
    this.themeMutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    this.refreshDarkModeActive();
  }

  private refreshDarkModeActive(): void {
    const themeAttribute = document.documentElement.getAttribute('data-theme');

    if (themeAttribute) {
      this.darkModeActive.set(DARK_THEME_NAMES.has(themeAttribute));
      return;
    }

    this.darkModeActive.set(this.darkMediaQuery?.matches ?? false);
  }

  private async initEditor(): Promise<void> {
    const host = this.editorHost()?.nativeElement;

    if (!host) {
      return;
    }

    try {
      const monacoApi = await loadMonaco();
      this.monacoApi = monacoApi;

      this.editor = monacoApi.editor.create(host, {
        value: this.value() ?? '',
        language: this.language(),
        readOnly: this.isReadOnly(),
        automaticLayout: true,
        minimap: { enabled: this.minimap() },
        wordWrap: this.wordWrap() ? 'on' : 'off',
        fontSize: this.fontSize(),
        theme: this.resolvedMonacoTheme(),
        ariaLabel: this.label() || 'Code editor',
        scrollBeyondLastLine: false,
        ...this.editorOptions(),
      });

      this.editor.onDidChangeModelContent(() => {
        if (this.applyingExternalValue || !this.editor) {
          return;
        }

        this.value.set(this.editor.getValue());
      });

      this.editor.onDidBlurEditorWidget(() => {
        this.touched.set(true);
      });

      this.loading.set(false);
    } catch {
      this.loadError.set('Failed to load the code editor.');
      this.loading.set(false);
    }
  }
}
