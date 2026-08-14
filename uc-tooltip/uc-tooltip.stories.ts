import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcButton } from '../uc-button/uc-button';
import { UcTooltip } from './uc-tooltip';

type ScreenAlign =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const SCREEN_ALIGN_FLEX: Record<ScreenAlign, { justifyContent: string; alignItems: string }> = {
  'top-left': { justifyContent: 'flex-start', alignItems: 'flex-start' },
  'top-center': { justifyContent: 'center', alignItems: 'flex-start' },
  'top-right': { justifyContent: 'flex-end', alignItems: 'flex-start' },
  'middle-left': { justifyContent: 'flex-start', alignItems: 'center' },
  'middle-center': { justifyContent: 'center', alignItems: 'center' },
  'middle-right': { justifyContent: 'flex-end', alignItems: 'center' },
  'bottom-left': { justifyContent: 'flex-start', alignItems: 'flex-end' },
  'bottom-center': { justifyContent: 'center', alignItems: 'flex-end' },
  'bottom-right': { justifyContent: 'flex-end', alignItems: 'flex-end' },
};

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
    screenAlign: 'middle-center',
  } as StoryObj<UcTooltip>['args'],
  argTypes: {
    screenAlign: {
      control: 'select',
      options: Object.keys(SCREEN_ALIGN_FLEX),
      description: 'Aligns the anchor button within the viewport to test tooltip flipping near screen edges.',
    },
  },
  render: (args) => {
    const screenAlign = (args as { screenAlign?: ScreenAlign }).screenAlign ?? 'middle-center';
    const { justifyContent, alignItems } = SCREEN_ALIGN_FLEX[screenAlign];
    return {
      props: args,
      template: `
        <div style="position: fixed; inset: 0; display: flex; justify-content: ${justifyContent}; align-items: ${alignItems}; padding: 24px; box-sizing: border-box;">
          <uc-button [ucTooltip]="ucTooltip" [text]="'Hover over me'"></uc-button>
        </div>
      `,
    };
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
