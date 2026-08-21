import type { Meta, StoryObj } from '@storybook/angular';
import { UcEditor } from './uc-editor';
import { UcEditorCommand, UcEditorFormat } from './uc-editor-format';
import { sanitizeEditorHtml } from './uc-editor-sanitizer';

const htmlSample = [
  '<h1>Release notes</h1>',
  '<p>The editor writes back in the format it opened, so this document stays <strong>HTML</strong>.</p>',
  '<ul><li>Toolbar built from uc components</li><li>Source view for the raw document</li></ul>',
].join('');

const markdownSample = [
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

/**
 * A third format, defined entirely through the public interface: a plain text document where every
 * block becomes a line and no inline marks survive.
 */
const plainTextFormat: UcEditorFormat = {
  id: 'text',
  label: 'Plain text',
  mimeType: 'text/plain',
  fileExtensions: ['.txt'],
  supports: (command) =>
    (['paragraph', 'bulletList', 'clearFormatting', 'undo', 'redo'] as UcEditorCommand[]).includes(
      command,
    ),
  toEditorHtml: (source) =>
    sanitizeEditorHtml(
      source
        .split('\n')
        .map((line) => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;') || '<br>'}</p>`)
        .join(''),
    ),
  fromEditorHtml: (html) => {
    const container = document.createElement('div');
    container.innerHTML = sanitizeEditorHtml(html);
    return [...container.children]
      .map((child) => child.textContent?.trim() ?? '')
      .join('\n')
      .trim();
  },
};

const meta: Meta<UcEditor> = {
  title: 'Components/Editor',
  component: UcEditor,
  parameters: {
    layout: 'padded',
  },
  args: {
    id: 'story-editor',
    label: 'Document',
    format: 'html',
    value: htmlSample,
    commands: null,
    disabled: false,
    readonly: false,
    showSourceToggle: true,
    showStatusBar: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-editor
        [id]="id"
        [label]="label"
        [format]="format"
        [commands]="commands"
        [disabled]="disabled"
        [readonly]="readonly"
        [showSourceToggle]="showSourceToggle"
        [showStatusBar]="showStatusBar"
        [(value)]="value"
      />
      <pre style="margin-top: 1rem; white-space: pre-wrap; color: var(--paragraph-text-color)">{{ value }}</pre>
    `,
  }),
};

export default meta;

type Story = StoryObj<UcEditor>;

export const Html: Story = {};

export const Markdown: Story = {
  args: {
    format: 'markdown',
    value: markdownSample,
  },
};

export const RestrictedToolbar: Story = {
  args: {
    format: 'markdown',
    value: markdownSample,
    commands: ['paragraph', 'heading2', 'bold', 'italic', 'bulletList', 'link'],
    showStatusBar: false,
  },
};

export const CustomFormat: Story = {
  args: {
    format: plainTextFormat,
    label: 'Plain text document',
    value: 'A custom format only has to implement UcEditorFormat.\nEach line is a block.',
  },
};

export const ReadOnly: Story = {
  args: {
    readonly: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
