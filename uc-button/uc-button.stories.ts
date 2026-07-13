import type { Meta, StoryObj } from '@storybook/angular';
import { UcButton, BUTTON_ALIGN_OPTIONS, BUTTON_TYPE_OPTIONS, BUTTON_VARIANT_OPTIONS } from './uc-button';

const meta: Meta<UcButton> = {
  title: 'Components/Button',
  component: UcButton,
  args: {
    text: 'Click Me',
    variant: 'primary',
    align: 'center',
    disabled: false,
    type: 'button',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: BUTTON_VARIANT_OPTIONS,
    },
    align: {
      control: { type: 'select' },
      options: BUTTON_ALIGN_OPTIONS,
    },
    type: {
      control: { type: 'select' },
      options: BUTTON_TYPE_OPTIONS,
    },
  },
};

export default meta;
type Story = StoryObj<UcButton>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    text: 'Secondary Action',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    text: 'Delete',
  },
};

export const WithPrefixIcon: Story = {
  args: {
    text: 'Save',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-button [text]="text" [variant]="variant" [align]="align" [disabled]="disabled" [type]="type">
        <i ucButtonPrefix class="ph-bold ph-floppy-disk"></i>
      </uc-button>
    `,
  }),
};

export const WithSuffixIcon: Story = {
  args: {
    text: 'Next',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-button [text]="text" [variant]="variant" [align]="align" [disabled]="disabled" [type]="type">
        <i ucButtonSuffix class="ph-bold ph-arrow-right"></i>
      </uc-button>
    `,
  }),
};

export const WithPrefixAndSuffixIcons: Story = {
  args: {
    text: 'Send Message',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-button [text]="text" [variant]="variant" [align]="align" [disabled]="disabled" [type]="type">
        <i ucButtonPrefix class="ph-bold ph-chat-circle"></i>
        <i ucButtonSuffix class="ph-bold ph-paper-plane-tilt"></i>
      </uc-button>
    `,
  }),
};

