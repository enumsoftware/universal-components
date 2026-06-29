import type { Meta, StoryObj } from '@storybook/angular';
import { UcSelect } from './uc-select';

const meta: Meta<UcSelect> = {
  title: 'Components/Select',
  component: UcSelect,
  args: {
    id: 'select-1',
    label: 'Country',
    placeholder: 'Select a country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'gb', label: 'United Kingdom' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
    ],
    disabled: false,
    value: null,
  },
};

export default meta;
type Story = StoryObj<UcSelect>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 'gb',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'us',
  },
};

export const WithError: Story = {
  args: {
    invalid: true,
    touched: true,
    errors: [{ message: 'Please select a country' }],
  },
};
