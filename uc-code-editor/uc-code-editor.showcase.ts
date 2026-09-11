import { bool, defineShowcase, number, select, text } from '../workbench/core';
import { UcCodeEditor } from './uc-code-editor';

const SAMPLE_TYPESCRIPT = `export interface User {
  id: number;
  name: string;
}

export function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
`;

export default defineShowcase({
  id: 'components/code-editor',
  group: 'Components',
  title: 'Code Editor',
  component: UcCodeEditor,
  layout: 'padded',
  knobs: {
    id: text('code-editor-1'),
    label: text('Snippet'),
    hideLabel: bool(false),
    language: text('typescript'),
    languageLabel: text(null),
    value: text(SAMPLE_TYPESCRIPT),
    mode: select(['edit', 'preview'] as const, 'edit'),
    height: text('320px'),
    showLanguageBadge: bool(true),
    showCopyButton: bool(true),
    minimap: bool(false),
    wordWrap: bool(false),
    fontSize: number(13, { min: 10, max: 24, step: 1 }),
    theme: select(['auto', 'light', 'dark'] as const, 'auto'),
    disabled: bool(false),
  },
  examples: [
    {
      name: 'C#',
      props: {
        language: 'csharp',
        value: 'public record User(int Id, string Name);\n',
      },
    },
    {
      name: 'JSON',
      props: {
        language: 'json',
        value: '{\n  "id": 1,\n  "name": "Ada Lovelace"\n}\n',
      },
    },
    { name: 'Preview Mode', props: { mode: 'preview' } },
    { name: 'Disabled', props: { disabled: true } },
    {
      name: 'With Error',
      props: { invalid: true, touched: true, errors: [{ kind: 'required', message: 'A snippet is required' }] },
    },
  ],
});
