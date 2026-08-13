import type { Meta, StoryObj } from '@storybook/angular';
import { UcSpinnerLoading } from './uc-spinner-loading.component';

const meta: Meta<UcSpinnerLoading> = {
  title: 'Components/Spinner Loading',
  component: UcSpinnerLoading,
  args: {
    loading: true,
  },
};

export default meta;
type Story = StoryObj<UcSpinnerLoading>;

const STORY_TEMPLATE =
  '<div style="display: flex; align-items: center; justify-content: center; width: 28rem; max-width: calc(100vw - 2rem);"><uc-spinner-loading [loading]="loading" [color]="color" [size]="size" [thickness]="thickness" /></div>';

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

export const CustomSize: Story = {
  args: {
    loading: true,
    size: '4rem',
  },
  render: (args) => ({
    props: args,
    template: STORY_TEMPLATE,
  }),
};

export const CustomThickness: Story = {
  args: {
    loading: true,
    size: '4rem',
    thickness: '0.75rem',
  },
  render: (args) => ({
    props: args,
    template: STORY_TEMPLATE,
  }),
};
