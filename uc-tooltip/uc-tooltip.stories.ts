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
        <uc-button [ucTooltip]="ucTooltip" [text]="'Hover over me'"></uc-button>
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

export const Positions: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 100px; display: flex; flex-wrap: wrap; gap: 24px; justify-content: center;">
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'top'" [text]="'top'"></uc-button>
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'top-start'" [text]="'top-start'"></uc-button>
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'top-end'" [text]="'top-end'"></uc-button>
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'bottom'" [text]="'bottom'"></uc-button>
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'bottom-start'" [text]="'bottom-start'"></uc-button>
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'bottom-end'" [text]="'bottom-end'"></uc-button>
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'left'" [text]="'left'"></uc-button>
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipPosition]="'right'" [text]="'right'"></uc-button>
      </div>
    `,
  }),
};

export const CustomMargin: Story = {
  args: {
    ucTooltip: 'Tooltip with a larger gap from the anchor',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 80px; display: flex; justify-content: center;">
        <uc-button [ucTooltip]="ucTooltip" [ucTooltipMargin]="'24px'" [text]="'Hover over me'"></uc-button>
      </div>
    `,
  }),
};
