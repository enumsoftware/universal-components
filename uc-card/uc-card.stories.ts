import type { Meta, StoryObj } from '@storybook/angular';
import { UcCard } from './uc-card';

const meta: Meta<UcCard> = {
  title: 'Components/Card',
  component: UcCard,
  args: {
    fit: 'fit',
  },
  render: (args) => ({
    props: args,
    template: `<uc-card [fit]="fit">Card content preview</uc-card>`,
  }),
};

export default meta;
type Story = StoryObj<UcCard>;

export const Fit: Story = {};

export const Fill: Story = {
  args: {
    fit: 'fill',
  },
  render: (args) => ({
    props: args,
    template: `<uc-card [fit]="fit">Fill mode card preview</uc-card>`,
  }),
};
