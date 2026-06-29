import type { Meta, StoryObj } from '@storybook/angular';
import { UcFlag } from './uc-flag';

const meta: Meta<UcFlag> = {
  title: 'Components/Flag',
  component: UcFlag,
  args: {
    countryCode: 'us',
    size: '2em',
    circular: false,
  },
};

export default meta;
type Story = StoryObj<UcFlag>;

export const Default: Story = {};

export const Circular: Story = {
  args: {
    circular: true,
  },
};

export const Large: Story = {
  args: {
    size: '4em',
  },
};

export const GB: Story = {
  args: {
    countryCode: 'gb',
  },
};

export const Unknown: Story = {
  args: {
    countryCode: null,
  },
};
