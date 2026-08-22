import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcEditor } from './uc-editor';
import { UcEditorFormatInput } from './uc-editor-formats';
import { UcHtmlEditorFormat } from './uc-html-editor-format';
import { UcMarkdownEditorFormat } from './uc-markdown-editor-format';
import { sanitizeEditorHtml } from './uc-editor-sanitizer';
import { markdownToHtml } from './uc-markdown-parser';
import { htmlToMarkdown } from './uc-markdown-serializer';

@Component({
  imports: [UcEditor],
  template: `
    <uc-editor
      id="editor"
      label="Document"
      [format]="format()"
      [(value)]="content"
      [disabled]="disabled()"
    />
  `,
})
class UcEditorHostComponent {
  readonly format = signal<UcEditorFormatInput>('markdown');
  readonly disabled = signal(false);
  readonly content = signal('');
}

describe('sanitizeEditorHtml', () => {
  it('should drop script subtrees and unwrap unknown elements', () => {
    const result = sanitizeEditorHtml('<p>Safe</p><script>alert(1)</script><section>Kept</section>');

    expect(result).toBe('<p>Safe</p>Kept');
  });

  it('should strip unsafe urls but keep safe ones', () => {
    expect(sanitizeEditorHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
    expect(sanitizeEditorHtml('<a href="https://example.com">x</a>')).toBe(
      '<a href="https://example.com">x</a>',
    );
  });

  it('should remove event handler attributes', () => {
    expect(sanitizeEditorHtml('<p onclick="alert(1)">x</p>')).toBe('<p>x</p>');
  });
});

describe('markdownToHtml', () => {
  it('should convert headings, emphasis and inline code', () => {
    expect(markdownToHtml('# Title')).toBe('<h1>Title</h1>');
    expect(markdownToHtml('**bold** and *italic* and ~~gone~~')).toBe(
      '<p><strong>bold</strong> and <em>italic</em> and <s>gone</s></p>',
    );
    expect(markdownToHtml('Use `npm run build`')).toBe('<p>Use <code>npm run build</code></p>');
  });

  it('should convert links and images', () => {
    expect(markdownToHtml('[docs](https://example.com)')).toBe(
      '<p><a href="https://example.com">docs</a></p>',
    );
    expect(markdownToHtml('![alt](https://example.com/a.png)')).toBe(
      '<p><img src="https://example.com/a.png" alt="alt"></p>',
    );
  });

  it('should leave unsafe link targets as literal text', () => {
    expect(markdownToHtml('[x](javascript:alert(1))')).toContain('[x](javascript:alert(1))');
  });

  it('should convert nested lists', () => {
    const html = markdownToHtml('- one\n  - nested\n- two');

    expect(html).toBe('<ul><li>one<ul><li>nested</li></ul></li><li>two</li></ul>');
  });

  it('should convert ordered lists, quotes, rules and fenced code', () => {
    expect(markdownToHtml('1. one\n2. two')).toBe('<ol><li>one</li><li>two</li></ol>');
    expect(markdownToHtml('> quoted')).toBe('<blockquote><p>quoted</p></blockquote>');
    expect(markdownToHtml('---')).toBe('<hr>');
    expect(markdownToHtml('```ts\nconst a = 1;\n```')).toBe(
      '<pre><code class="language-ts">const a = 1;</code></pre>',
    );
  });

  it('should escape html in the source text', () => {
    expect(markdownToHtml('<img src=x onerror=alert(1)>')).toBe(
      '<p>&lt;img src=x onerror=alert(1)&gt;</p>',
    );
  });
});

describe('htmlToMarkdown', () => {
  it('should serialize blocks and inline marks', () => {
    expect(htmlToMarkdown('<h2>Title</h2><p><strong>bold</strong> text</p>')).toBe(
      '## Title\n\n**bold** text',
    );
    expect(htmlToMarkdown('<p><em>em</em> <s>gone</s> <code>code</code></p>')).toBe(
      '*em* ~~gone~~ `code`',
    );
  });

  it('should serialize links, images and rules', () => {
    expect(htmlToMarkdown('<p><a href="https://example.com">docs</a></p>')).toBe(
      '[docs](https://example.com)',
    );
    expect(htmlToMarkdown('<p><img src="a.png" alt="alt"></p>')).toBe('![alt](a.png)');
    expect(htmlToMarkdown('<hr>')).toBe('---');
  });

  it('should serialize nested lists with indentation', () => {
    const markdown = htmlToMarkdown('<ul><li>one<ul><li>nested</li></ul></li><li>two</li></ul>');

    expect(markdown).toBe('- one\n  - nested\n- two');
  });

  it('should drop marks markdown cannot express but keep their text', () => {
    expect(htmlToMarkdown('<p><u>plain</u></p>')).toBe('plain');
  });

  it('should round-trip a document', () => {
    const source = [
      '# Title',
      '',
      'Intro with **bold**, *italic* and [a link](https://example.com).',
      '',
      '- one',
      '  - nested',
      '- two',
      '',
      '> quoted',
      '',
      '```ts',
      'const a = 1;',
      '```',
    ].join('\n');

    expect(htmlToMarkdown(markdownToHtml(source))).toBe(source);
  });
});

describe('UcHtmlEditorFormat', () => {
  const format = new UcHtmlEditorFormat();

  it('should support every command', () => {
    expect(format.supports('underline')).toBe(true);
    expect(format.supports('codeBlock')).toBe(true);
  });

  it('should indent block structure when serializing', () => {
    expect(format.fromEditorHtml('<ul><li>one</li><li>two</li></ul>')).toBe(
      '<ul>\n  <li>one</li>\n  <li>two</li>\n</ul>',
    );
  });

  it('should sanitize on the way into the editor', () => {
    expect(format.toEditorHtml('<p>ok</p><script>alert(1)</script>')).toBe('<p>ok</p>');
  });
});

describe('UcMarkdownEditorFormat', () => {
  const format = new UcMarkdownEditorFormat();

  it('should not support underline', () => {
    expect(format.supports('underline')).toBe(false);
    expect(format.supports('bold')).toBe(true);
  });
});

describe('UcEditor', () => {
  let fixture: ComponentFixture<UcEditorHostComponent>;
  let host: UcEditorHostComponent;

  const surface = (): HTMLElement => fixture.nativeElement.querySelector('.uc-editor__surface');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcEditorHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UcEditorHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should render the value through the active format', async () => {
    host.content.set('# Hello');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(surface().innerHTML).toBe('<h1>Hello</h1>');
  });

  it('should write edits back in the format source text', () => {
    surface().innerHTML = '<h2>Edited</h2>';
    surface().dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.content()).toBe('## Edited');
  });

  it('should re-render when the format changes', async () => {
    host.content.set('# Hello');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(surface().innerHTML).toBe('<h1>Hello</h1>');

    host.format.set('html');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(surface().innerHTML).toBe('# Hello');
  });

  it('should hide commands the format does not support', () => {
    const labels = () =>
      [...fixture.nativeElement.querySelectorAll('.uc-editor__toolbar button')].map((button) =>
        (button as HTMLButtonElement).getAttribute('aria-label'),
      );

    expect(labels()).not.toContain('Underline');

    host.format.set('html');
    fixture.detectChanges();

    expect(labels()).toContain('Underline');
  });

  it('should mark the mark and structure buttons as toggles', () => {
    const button = (label: string) =>
      fixture.nativeElement.querySelector(
        `.uc-editor__toolbar button[aria-label="${label}"]`,
      ) as HTMLButtonElement;

    expect(button('Bold').getAttribute('aria-pressed')).toBe('false');
    expect(button('Bulleted list').getAttribute('aria-pressed')).toBe('false');

    // Insert opens a panel and undo/redo are one-shot actions, so neither is a toggle.
    expect(button('Image').hasAttribute('aria-pressed')).toBe(false);
    expect(button('Undo').hasAttribute('aria-pressed')).toBe(false);
  });

  it('should show the source text in the source view', async () => {
    host.content.set('# Hello');
    fixture.detectChanges();
    await fixture.whenStable();

    const editor = fixture.debugElement.children[0].componentInstance as UcEditor;
    editor.setView('source');
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector(
      '.uc-editor__source',
    ) as HTMLTextAreaElement;
    expect(textarea.value).toBe('# Hello');

    editor.setView('wysiwyg');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(surface().innerHTML).toBe('<h1>Hello</h1>');
  });

  it('should show both panes in the split view', async () => {
    host.content.set('# Hello');
    fixture.detectChanges();
    await fixture.whenStable();

    const editor = fixture.debugElement.children[0].componentInstance as UcEditor;
    editor.setView('split');
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector(
      '.uc-editor__source',
    ) as HTMLTextAreaElement;
    expect(surface().innerHTML).toBe('<h1>Hello</h1>');
    expect(textarea.value).toBe('# Hello');

    // Two textboxes at once, so the surface keeps `id` and the source pane derives its own.
    expect(surface().getAttribute('id')).toBe('editor');
    expect(textarea.getAttribute('id')).toBe('editor-source');
  });

  it('should mirror source edits onto the surface in the split view', async () => {
    const editor = fixture.debugElement.children[0].componentInstance as UcEditor;
    editor.setView('split');
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea = fixture.nativeElement.querySelector(
      '.uc-editor__source',
    ) as HTMLTextAreaElement;
    textarea.value = '## Edited';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.content()).toBe('## Edited');
    expect(surface().innerHTML).toBe('<h2>Edited</h2>');
  });

  it('should make the surface non-editable when disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();

    expect(surface().getAttribute('contenteditable')).toBe('false');
  });

  it('should seed an empty paragraph for an empty document', () => {
    expect(surface().innerHTML).toBe('<p><br></p>');
  });
});
