import type { Meta, StoryObj } from '@storybook/angular';
import { UcArrowButton } from './uc-arrow-button';

const meta: Meta<UcArrowButton> = {
  title: 'Components/Arrow Button',
  component: UcArrowButton,
  args: {
    text: 'Continue',
    variant: 'primary',
    phosphorIcon: 'arrow-right',
    iconPosition: 'end',
    padded: false,
  },
};

export default meta;
type Story = StoryObj<UcArrowButton>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    text: 'Go Back',
    phosphorIcon: 'arrow-left',
    iconPosition: 'start',
  },
};

export const Padded: Story = {
  args: {
    padded: true,
  },
};
