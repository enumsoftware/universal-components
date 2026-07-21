import type { Meta, StoryObj } from '@storybook/angular';
import { PHOSPHOR_ICON_WEIGHT_OPTIONS, UcPhosphorIcon } from './uc-phosphor-icon';

const meta: Meta<UcPhosphorIcon> = {
  title: 'Components/Phosphor Icon',
  component: UcPhosphorIcon,
  args: {
    icon: 'house',
    weight: 'regular',
  },
  argTypes: {
    weight: {
      control: { type: 'select' },
      options: PHOSPHOR_ICON_WEIGHT_OPTIONS,
    },
  },
};

export default meta;
type Story = StoryObj<UcPhosphorIcon>;

export const Default: Story = {};

export const Bold: Story = {
  args: {
    icon: 'gear',
    weight: 'bold',
  },
};

export const Fill: Story = {
  args: {
    icon: 'heart',
    weight: 'fill',
  },
};
