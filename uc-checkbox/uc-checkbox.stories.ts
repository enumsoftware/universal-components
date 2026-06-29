import type { Meta, StoryObj } from '@storybook/angular';
import { UcCheckbox } from './uc-checkbox';

const meta: Meta<UcCheckbox> = {
  title: 'Components/Checkbox',
  component: UcCheckbox,
  args: {
    id: 'checkbox-1',
    label: 'Accept terms and conditions',
    checked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<UcCheckbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
