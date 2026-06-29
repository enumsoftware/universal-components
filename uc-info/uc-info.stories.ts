import type { Meta, StoryObj } from '@storybook/angular';
import { UcInfo } from './uc-info';

const meta: Meta<UcInfo> = {
  title: 'Components/Info',
  component: UcInfo,
  args: {
    variant: 'info',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-info [variant]="variant">
        <span title>Information title</span>
        This is an informational message to the user.
      </uc-info>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcInfo>;

export const Info: Story = {};

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-info [variant]="variant">
        <span title>Warning title</span>
        Please review your input before proceeding.
      </uc-info>
    `,
  }),
};

export const Error: Story = {
  args: {
    variant: 'error',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-info [variant]="variant">
        <span title>Error title</span>
        Something went wrong. Please try again.
      </uc-info>
    `,
  }),
};
