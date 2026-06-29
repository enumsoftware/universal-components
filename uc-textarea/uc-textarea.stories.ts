import type { Meta, StoryObj } from '@storybook/angular';
import { UcTextarea } from './uc-textarea';

const meta: Meta<UcTextarea> = {
  title: 'Components/Textarea',
  component: UcTextarea,
  args: {
    id: 'textarea-1',
    label: 'Description',
    placeholder: 'Enter a description...',
    rows: 5,
    disabled: false,
    readonly: false,
    value: null,
  },
};

export default meta;
type Story = StoryObj<UcTextarea>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This is some pre-filled content.',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'This is read-only content.',
  },
};

export const WithError: Story = {
  args: {
    invalid: true,
    touched: true,
    errors: [{ message: 'Description is required' }],
  },
};
