import type { Meta, StoryObj } from '@storybook/angular';
import { UcIconButton, ICON_BUTTON_VARIANT_OPTIONS } from './uc-icon-button';

const meta: Meta<UcIconButton> = {
  title: 'Components/Icon Button',
  component: UcIconButton,
  args: {
    label: 'Edit item',
    phosphorIcon: 'pencil',
    phosphorWeight: 'bold',
    variant: 'primary',
    disabled: false,
    inverseColor: false,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ICON_BUTTON_VARIANT_OPTIONS,
    },
  },
};

export default meta;
type Story = StoryObj<UcIconButton>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

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
          [label]="label"
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
