import { bool, defineShowcase, object, select, text } from '../workbench/core';
import type { UcEditorCommand } from './uc-editor-format';
import { EditorPreview } from './examples/editor-preview';
import { PLAIN_TEXT_FORMAT } from './examples/plain-text-format';

const HTML_SAMPLE = [
  '<h1>Release notes</h1>',
  '<p>The editor writes back in the format it opened, so this document stays <strong>HTML</strong>.</p>',
  '<ul><li>Toolbar built from uc components</li><li>Source view for the raw document</li></ul>',
].join('');

const MARKDOWN_SAMPLE = [
  '# Release notes',
  '',
  'The same editor, opened with the Markdown format. Underline is hidden because Markdown',
  'cannot express it.',
  '',
  '- Toolbar built from uc components',
  '- Source view for the raw document',
  '',
  '> Formats are swappable: implement `UcEditorFormat` and pass it to `format`.',
].join('\n');

export default defineShowcase({
  id: 'components/editor',
  group: 'Components',
  title: 'Editor',
  layout: 'padded',
  component: EditorPreview,
  knobs: {
    id: text('showcase-editor'),
    label: text('Document'),
    format: select(['html', 'markdown'] as const, 'html'),
    value: text(HTML_SAMPLE),
    commands: object<readonly UcEditorCommand[] | null>(null),
    view: select(['wysiwyg', 'source', 'split'] as const, 'wysiwyg'),
    showSourceToggle: bool(true),
    showSplitToggle: bool(true),
    showStatusBar: bool(true),
    disabled: bool(false),
    readonly: bool(false),
  },
  examples: [
    { name: 'Markdown', props: { format: 'markdown', value: MARKDOWN_SAMPLE } },
    {
      name: 'Split View',
      description: 'Rich text and source side by side; edits in either pane land in the other.',
      props: { view: 'split' },
    },
    {
      name: 'Restricted Toolbar',
      props: {
        format: 'markdown',
        value: MARKDOWN_SAMPLE,
        commands: ['paragraph', 'heading2', 'bold', 'italic', 'bulletList', 'link'],
        showStatusBar: false,
      },
    },
    {
      name: 'Custom Format',
      description: 'A custom format only has to implement `UcEditorFormat`.',
      props: {
        format: PLAIN_TEXT_FORMAT,
        label: 'Plain text document',
        value: 'A custom format only has to implement UcEditorFormat.\nEach line is a block.',
      },
    },
    { name: 'Read Only', props: { readonly: true } },
    { name: 'Disabled', props: { disabled: true } },
  ],
});
