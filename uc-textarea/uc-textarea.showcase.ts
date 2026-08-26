import { bool, defineShowcase, number, text } from '../workbench/core';
import { UcTextarea } from './uc-textarea';

export default defineShowcase({
  id: 'components/textarea',
  group: 'Components',
  title: 'Textarea',
  component: UcTextarea,
  knobs: {
    id: text('textarea-1'),
    label: text('Description'),
    hideLabel: bool(false),
    placeholder: text('Enter a description...'),
    rows: number(5, { min: 1, max: 20 }),
    value: text(null),
    disabled: bool(false),
    readonly: bool(false),
  },
  examples: [
    { name: 'Hidden Label', props: { hideLabel: true } },
    { name: 'Disabled', props: { disabled: true, value: 'This is some pre-filled content.' } },
    { name: 'Readonly', props: { readonly: true, value: 'This is read-only content.' } },
    {
      name: 'With Error',
      props: { invalid: true, touched: true, errors: [{ kind: 'required', message: 'Description is required' }] },
    },
  ],
});
