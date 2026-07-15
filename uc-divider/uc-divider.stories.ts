import type { Meta, StoryObj } from '@storybook/angular';
import { UcDivider } from './uc-divider';

const meta: Meta<UcDivider> = {
  title: 'Components/Divider',
  component: UcDivider,
  args: {
    inverse: false,
    vertical: false,
  },
};

export default meta;
type Story = StoryObj<UcDivider>;

const HORIZONTAL_STORY_TEMPLATE =
  '<div style="display: block; width: 28rem; max-width: calc(100vw - 2rem);"><uc-divider [inverse]="inverse" [vertical]="vertical" [text]="text" /></div>';

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: HORIZONTAL_STORY_TEMPLATE,
  }),
};

export const WithText: Story = {
  args: {
    text: 'or',
  },
  render: (args) => ({
    props: args,
    template: HORIZONTAL_STORY_TEMPLATE,
  }),
};

export const Inverse: Story = {
  args: {
    inverse: true,
  },
  render: (args) => ({
    props: args,
    template: HORIZONTAL_STORY_TEMPLATE,
  }),
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
  render: (args) => ({
    props: args,
    template: `<div style="height: 60px; display: flex; align-items: center;"><uc-divider [vertical]="vertical" [inverse]="inverse" /></div>`,
  }),
};
