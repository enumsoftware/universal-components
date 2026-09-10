import { bool, defineShowcase, number, object, select, text } from '../workbench/core';
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
    searchable: bool(false),
    displayMode: select(['auto', 'dropdown', 'dialog'] as const, 'auto'),
    loadMode: select(['all', 'page', 'infinite'] as const, 'all'),
    serverSearch: bool(false),
    pageSize: number(25, { min: 1, step: 1 }),
  },
  examples: [
    {
      name: 'Hidden Label',
      description: 'The label still names the trigger for screen readers, it just is not painted.',
      props: { hideLabel: true },
    },
    { name: 'With Value', props: { value: 'gb' } },
    { name: 'Searchable', props: { searchable: true } },
    { name: 'Dialog Mode', props: { displayMode: 'dialog' } },
    { name: 'Disabled', props: { disabled: true, value: 'us' } },
    {
      name: 'With Error',
      props: { invalid: true, touched: true, errors: [{ kind: 'required', message: 'Please select a country' }] },
    },
  ],
});
