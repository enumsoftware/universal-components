import type { Meta, StoryObj } from '@storybook/angular';
import { UcSidebarButton } from './uc-sidebar-button';

const meta: Meta<UcSidebarButton> = {
  title: 'Components/Sidebar Button',
  component: UcSidebarButton,
  args: {
    text: 'Dashboard',
    active: false,
    style: 'primary',
    phosphorIcon: 'house',
  },
};

export default meta;
type Story = StoryObj<UcSidebarButton>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
  },
};

export const Secondary: Story = {
  args: {
    style: 'secondary',
    text: 'Settings',
    phosphorIcon: 'gear',
  },
};

export const WithoutIcon: Story = {
  args: {
    phosphorIcon: undefined,
    text: 'Reports',
  },
};
