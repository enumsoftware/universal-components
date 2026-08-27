import { bool, defineShowcase, object, text } from '../workbench/core';
import { UcSelect } from './uc-select';

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

export default defineShowcase({
  id: 'components/select',
  group: 'Components',
  title: 'Select',
  component: UcSelect,
  knobs: {
    id: text('select-1'),
    label: text('Country'),
    hideLabel: bool(false),
    placeholder: text('Select a country'),
    options: object(COUNTRIES),
    value: text(null),
    disabled: bool(false),
  },
  examples: [
    {
      name: 'Hidden Label',
      description: 'The label still names the trigger for screen readers, it just is not painted.',
      props: { hideLabel: true },
    },
    { name: 'With Value', props: { value: 'gb' } },
    { name: 'Disabled', props: { disabled: true, value: 'us' } },
    {
      name: 'With Error',
      props: { invalid: true, touched: true, errors: [{ kind: 'required', message: 'Please select a country' }] },
    },
  ],
});
