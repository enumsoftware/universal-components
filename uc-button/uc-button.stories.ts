import type { Meta, StoryObj } from '@storybook/angular';
import { UcButton, BUTTON_ALIGN_OPTIONS, BUTTON_TYPE_OPTIONS, BUTTON_VARIANT_OPTIONS } from './uc-button';

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
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: BUTTON_VARIANT_OPTIONS,
    },
    align: {
      control: { type: 'select' },
      options: BUTTON_ALIGN_OPTIONS,
    },
    type: {
      control: { type: 'select' },
      options: BUTTON_TYPE_OPTIONS,
    },
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
