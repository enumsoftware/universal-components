import type { Meta, StoryObj } from '@storybook/angular';
import { UcTooltip } from './uc-tooltip';

const meta: Meta<UcTooltip> = {
  title: 'Components/Tooltip',
  component: UcTooltip,
  args: {
    ucTooltip: 'This is a helpful tooltip',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 80px; display: flex; justify-content: center;">
        <button [ucTooltip]="ucTooltip" style="padding: 8px 16px; cursor: pointer;">
          Hover over me
        </button>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcTooltip>;

export const Default: Story = {};

export const LongText: Story = {
  args: {
    ucTooltip: 'This is a longer tooltip with more detailed information for the user.',
  },
};
