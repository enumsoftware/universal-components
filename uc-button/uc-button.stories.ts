import type { Meta, StoryObj } from '@storybook/angular';
import { UcButton } from './uc-button';

const meta: Meta<UcButton> = {
  title: 'Components/Button',
  component: UcButton,
  args: {
    text: 'Click Me',
    variant: 'primary',
    align: 'center',
    disabled: false,
    showArrow: false,
    type: 'button',
  },
};

export default meta;
type Story = StoryObj<UcButton>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    text: 'Secondary Action',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    text: 'Delete',
  },
};
