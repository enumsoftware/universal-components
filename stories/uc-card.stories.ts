import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { UcCard } from '../uc-card/uc-card';

type CardStoryArgs = {
  body: string;
  fit: 'fit' | 'fill';
  title: string;
};

const meta = {
  title: 'Components/UcCard',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [UcCard],
    }),
  ],
  argTypes: {
    fit: {
      control: 'inline-radio',
      options: ['fit', 'fill'],
    },
  },
  args: {
    body: 'Use cards to group related content and actions in a compact container.',
    fit: 'fit',
    title: 'Card title',
  },
  render: (args: CardStoryArgs) => ({
    props: args,
    template: `
      <div style="width: min(100%, 32rem);">
        <uc-card [fit]="fit">
          <div style="display: grid; gap: 0.75rem;">
            <strong>{{ title }}</strong>
            <p style="margin: 0; color: #475569;">{{ body }}</p>
          </div>
        </uc-card>
      </div>
    `,
  }),
} satisfies Meta<CardStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Fill: Story = {
  args: {
    fit: 'fill',
  },
};
