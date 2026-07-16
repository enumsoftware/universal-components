import type { Meta, StoryObj } from '@storybook/angular';
import { UcLinearLoading } from './uc-linear-loading.component';

const meta: Meta<UcLinearLoading> = {
  title: 'Components/Linear Loading',
  component: UcLinearLoading,
  args: {
    loading: true,
  },
};

export default meta;
type Story = StoryObj<UcLinearLoading>;

const STORY_TEMPLATE =
  '<div style="display: block; width: 28rem; max-width: calc(100vw - 2rem);"><uc-linear-loading [loading]="loading" [color]="color" /></div>';

export const Loading: Story = {
  render: (args) => ({
    props: args,
    template: STORY_TEMPLATE,
  }),
};

export const NotLoading: Story = {
  args: {
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: STORY_TEMPLATE,
  }),
};

export const CustomColor: Story = {
  args: {
    loading: true,
    color: '#ff5733',
  },
  render: (args) => ({
    props: args,
    template: STORY_TEMPLATE,
  }),
};
