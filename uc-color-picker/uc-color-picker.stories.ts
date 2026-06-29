import type { Meta, StoryObj } from '@storybook/angular';
import { UcColorPicker } from './uc-color-picker';

const meta: Meta<UcColorPicker> = {
  title: 'Components/Color Picker',
  component: UcColorPicker,
  args: {
    id: 'color-picker-1',
    label: 'Brand color',
    placeholder: 'Pick a color',
    value: '#473bf0',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<UcColorPicker>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '#473bf0',
  },
};
