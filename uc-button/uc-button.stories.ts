import type { Meta, StoryObj } from '@storybook/angular';
import {
  UcButton,
  BUTTON_ALIGN_OPTIONS,
  BUTTON_SIZE_OPTIONS,
  BUTTON_TYPE_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
} from './uc-button';

const meta: Meta<UcButton> = {
  title: 'Components/Button',
  component: UcButton,
  args: {
    text: 'Click Me',
    variant: 'primary',
    size: 'medium',
    align: 'center',
    disabled: false,
    loading: false,
    loadingText: undefined,
    type: 'button',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: BUTTON_VARIANT_OPTIONS,
    },
    size: {
      control: { type: 'select' },
      options: BUTTON_SIZE_OPTIONS,
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

export const Small: Story = {
  args: {
    size: 'small',
    text: 'Compact',
  },
};

export const Big: Story = {
  args: {
    size: 'big',
    text: 'Larger Action',
  },
};

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

export const TableActionPrimaryEquivalent: Story = {
  args: {
    text: 'Edit',
    variant: 'primary',
    size: 'small',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-button [text]="text" [variant]="variant" [size]="size" [align]="align" [disabled]="disabled" [type]="type">
        <i ucButtonPrefix class="ph-bold ph-pencil"></i>
      </uc-button>
    `,
  }),
};

export const TableActionSecondaryEquivalent: Story = {
  args: {
    text: 'View',
    variant: 'secondary',
    size: 'small',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-button [text]="text" [variant]="variant" [size]="size" [align]="align" [disabled]="disabled" [type]="type">
        <i ucButtonPrefix class="ph-bold ph-eye"></i>
      </uc-button>
    `,
  }),
};

export const Loading: Story = {
  args: {
    text: 'Save invoice',
    loading: true,
  },
};

export const LoadingWithText: Story = {
  args: {
    text: 'Save invoice',
    loading: true,
    loadingText: 'Saving…',
  },
};

export const LoadingSmall: Story = {
  args: {
    text: 'Edit',
    size: 'small',
    loading: true,
  },
};

export const LoadingBig: Story = {
  args: {
    text: 'Larger Action',
    size: 'big',
    loading: true,
  },
};

export const LoadingVariants: Story = {
  args: {
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <uc-button text="Primary" variant="primary" [size]="size" [loading]="loading" />
        <uc-button text="Secondary" variant="secondary" [size]="size" [loading]="loading" />
        <uc-button text="Delete" variant="error" [size]="size" [loading]="loading" />
      </div>
    `,
  }),
};

/**
 * The consumer owns the state: a signal flipped around the async call. The button stays dumb, and
 * the repeated clicks show that it refuses to re-emit while a request is in flight.
 */
export const ConsumerOwnedSignal: Story = {
  args: {
    text: 'Save invoice',
  },
  render: (args) => ({
    props: {
      ...args,
      saving: false,
      clickCount: 0,
      save(this: { saving: boolean; clickCount: number }) {
        if (this.saving) {
          return;
        }
        this.clickCount += 1;
        this.saving = true;
        setTimeout(() => (this.saving = false), 2000);
      },
    },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <uc-button
          [text]="text"
          [variant]="variant"
          [size]="size"
          [align]="align"
          [disabled]="disabled"
          [type]="type"
          [loading]="saving"
          (clicked)="save()"
        >
          <i ucButtonPrefix class="ph-bold ph-floppy-disk"></i>
        </uc-button>
        <span>Emitted clicks: {{ clickCount }}</span>
      </div>
    `,
  }),
};

