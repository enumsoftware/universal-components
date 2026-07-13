import type { Meta, StoryObj } from '@storybook/angular';
import { UcButton } from './uc-button';

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
        <i ucPrefix class="ph-bold ph-floppy-disk"></i>
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
        <i ucSuffix class="ph-bold ph-arrow-right"></i>
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
        <i ucPrefix class="ph-bold ph-chat-circle"></i>
        <i ucSuffix class="ph-bold ph-paper-plane-tilt"></i>
      </uc-button>
    `,
  }),
};

