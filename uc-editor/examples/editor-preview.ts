import { Component, effect, input, signal } from '@angular/core';

import { UcEditor } from '../uc-editor';
import type { UcEditorCommand } from '../uc-editor-format';
import type { UcEditorFormatInput } from '../uc-editor-formats';
import type { UcEditorView } from '../uc-editor';

/**
 * Echoes the live document under the editor, which is the point of the
 * component: it writes back in the format it opened with.
 */
@Component({
  selector: 'uc-editor-preview',
  imports: [UcEditor],
  styles: `
    pre {
      margin-top: 1rem;
      white-space: pre-wrap;
      color: var(--paragraph-text-color);
    }
  `,
  template: `
    <uc-editor
      [id]="id()"
      [label]="label()"
      [format]="format()"
      [commands]="commands()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [showSourceToggle]="showSourceToggle()"
      [showSplitToggle]="showSplitToggle()"
      [showStatusBar]="showStatusBar()"
      [view]="view()"
      [(value)]="document"
    />
    <pre>{{ document() }}</pre>
  `,
})
export class EditorPreview {
  readonly id = input<string>('showcase-editor');
  readonly label = input<string>('Document');
  readonly format = input<UcEditorFormatInput>('html');
  readonly value = input<string>('');
  readonly commands = input<readonly UcEditorCommand[] | null>(null);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly showSourceToggle = input<boolean>(true);
  readonly showSplitToggle = input<boolean>(true);
  readonly showStatusBar = input<boolean>(true);
  readonly view = input<UcEditorView>('wysiwyg');

  protected readonly document = signal('');

  constructor() {
    // The knob seeds the document; typing takes over from there.
    effect(() => this.document.set(this.value()));
  }
}
