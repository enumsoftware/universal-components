import type { Meta, StoryObj } from '@storybook/angular';
import { UcAvatar } from './uc-avatar';

const meta: Meta<UcAvatar> = {
  title: 'Components/Avatar',
  component: UcAvatar,
  args: {
    initials: 'JD',
    backgroundColor: '#146c94',
    icon: 'user',
    size: '2.5rem',
    alt: 'Jane Doe',
  },
  argTypes: {
    backgroundColor: {
      control: { type: 'color' },
    },
  },
};

export default meta;
type Story = StoryObj<UcAvatar>;

export const Initials: Story = {};

export const Image: Story = {
  args: {
    imageUrl: 'https://i.pravatar.cc/160?img=47',
  },
};

export const IconFallback: Story = {
  args: {
    initials: null,
    icon: 'user',
  },
};

export const CustomAppearance: Story = {
  args: {
    initials: 'UC',
    backgroundColor: '#b42318',
    size: '4rem',
  },
};