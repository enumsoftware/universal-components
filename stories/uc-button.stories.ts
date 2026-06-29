import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { UcButton } from '../uc-button/uc-button';

type ButtonStoryArgs = {
  align: 'left' | 'center';
  clicked: () => void;
  disabled: boolean;
  showArrow: boolean;
  text: string;
  type: 'button' | 'submit' | 'reset';
  variant: 'primary' | 'secondary' | 'error';
};

const meta = {
  title: 'Components/UcButton',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [UcButton],
    }),
  ],
  argTypes: {
    clicked: { action: 'clicked' },
    align: {
      control: 'inline-radio',
      options: ['left', 'center'],
    },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset'],
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'error'],
    },
  },
  args: {
    align: 'center',
    disabled: false,
    showArrow: false,
    text: 'Continue',
    type: 'button',
    variant: 'primary',
  },
  render: (args: ButtonStoryArgs) => ({
    props: args,
    template: `
      <uc-button
        [align]="align"
        [disabled]="disabled"
        [showArrow]="showArrow"
        [text]="text"
        [type]="type"
        [variant]="variant"
        (clicked)="clicked()"
      ></uc-button>
    `,
  }),
} satisfies Meta<ButtonStoryArgs>;

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Error: Story = {
  args: {
    text: 'Delete',
    variant: 'error',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
