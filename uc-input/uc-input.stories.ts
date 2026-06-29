import type { Meta, StoryObj } from '@storybook/angular';
import { UcInput } from './uc-input';

const meta: Meta<UcInput> = {
  title: 'Components/Input',
  component: UcInput,
  args: {
    id: 'input-1',
    label: 'Email address',
    placeholder: 'Enter your email',
    type: 'text',
    disabled: false,
    readonly: false,
    value: null,
  },
};

export default meta;
type Story = StoryObj<UcInput>;

export const Default: Story = {};

export const Password: Story = {
  args: {
    id: 'input-password',
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    togglePassword: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'user@example.com',
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
    value: 'user@example.com',
  },
};

export const WithError: Story = {
  args: {
    invalid: true,
    touched: true,
    // errors: [{ message: 'This field is required' }],
  },
};
