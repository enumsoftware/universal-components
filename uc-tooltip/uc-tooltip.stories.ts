import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcButton } from '../uc-button/uc-button';
import { UcTooltip } from './uc-tooltip';

const meta: Meta<UcTooltip> = {
  title: 'Components/Tooltip',
  component: UcTooltip,
  decorators: [
    moduleMetadata({
      imports: [UcButton],
    }),
  ],
  args: {
    ucTooltip: 'This is a helpful tooltip',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 80px; display: flex; justify-content: center;">
        <uc-button [ucTooltip]="ucTooltip" [text]="'Hover over me'" style="cursor: pointer;"></uc-button>
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
