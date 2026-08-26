import { bool, defineShowcase, select, text } from '../workbench/core';
import { UcInput } from './uc-input';

export default defineShowcase({
  id: 'components/input',
  group: 'Components',
  title: 'Input',
  // Padded gives the field a block context to fill, which is what the old
  // story's hardcoded min-width wrapper was standing in for.
  layout: 'padded',
  component: UcInput,
  knobs: {
    id: text('input-1'),
    label: text('Email address'),
    hideLabel: bool(false),
    placeholder: text('Enter your email'),
    type: select(['text', 'email', 'password', 'number', 'tel', 'url', 'datetime-local'] as const, 'text'),
    togglePassword: bool(false),
    value: text(null),
    disabled: bool(false),
    readonly: bool(false),
  },
  examples: [
    { name: 'Hidden Label', props: { hideLabel: true } },
    {
      name: 'Password',
      props: {
        id: 'input-password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        togglePassword: true,
      },
    },
    { name: 'Disabled', props: { disabled: true, value: 'user@example.com' } },
    { name: 'Readonly', props: { readonly: true, value: 'user@example.com' } },
    {
      name: 'With Error',
      props: { invalid: true, touched: true, errors: [{ kind: 'required', message: 'This field is required' }] },
    },
  ],
});
