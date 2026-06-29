import type { Meta, StoryObj } from '@storybook/angular';
import { UcSlider } from './uc-slider';

const meta: Meta<UcSlider> = {
  title: 'Components/Slider',
  component: UcSlider,
  args: {
    id: 'slider-1',
    label: 'Volume',
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    showValue: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<UcSlider>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithSteps: Story = {
  args: {
    label: 'Rating',
    min: 1,
    max: 5,
    step: 1,
    value: 3,
  },
};
