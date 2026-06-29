import type { Meta, StoryObj } from '@storybook/angular';
import { UcIconButton } from './uc-icon-button';

const meta: Meta<UcIconButton> = {
  title: 'Components/Icon Button',
  component: UcIconButton,
  args: {
    phosphorIcon: 'pencil',
    phosphorWeight: 'bold',
    variant: 'primary',
    disabled: false,
    inverseColor: false,
  },
};

export default meta;
type Story = StoryObj<UcIconButton>;

export const Primary: Story = {};

export const Error: Story = {
  args: {
    variant: 'error',
    phosphorIcon: 'trash',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Inverse: Story = {
  args: {
    inverseColor: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="background: #333; padding: 16px; display: inline-block;">
        <uc-icon-button
          [phosphorIcon]="phosphorIcon"
          [phosphorWeight]="phosphorWeight"
          [variant]="variant"
          [disabled]="disabled"
          [inverseColor]="inverseColor"
        />
      </div>
    `,
  }),
};
