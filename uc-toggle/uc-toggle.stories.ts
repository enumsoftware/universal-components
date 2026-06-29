import type { Meta, StoryObj } from '@storybook/angular';
import { UcToggle } from './uc-toggle';

const meta: Meta<UcToggle> = {
  title: 'Components/Toggle',
  component: UcToggle,
  args: {
    checked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<UcToggle>;

export const Off: Story = {};

export const On: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
