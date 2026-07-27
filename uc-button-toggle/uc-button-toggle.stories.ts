import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcButtonToggle } from './uc-button-toggle';
import { UcButtonToggleItem } from './uc-button-toggle-item';

const meta: Meta<UcButtonToggle> = {
  title: 'Components/Button Toggle',
  component: UcButtonToggle,
  decorators: [
    moduleMetadata({
      imports: [UcButtonToggleItem],
    }),
  ],
  args: {
    value: 'all',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-button-toggle [(value)]="value" [disabled]="disabled">
        <uc-button-toggle-item value="all">All</uc-button-toggle-item>
        <uc-button-toggle-item value="products">Products</uc-button-toggle-item>
        <uc-button-toggle-item value="saved" [disabled]="true" ariaLabel="Saved items">
          <i class="ph-bold ph-bookmark-simple"></i>
        </uc-button-toggle-item>
        <uc-button-toggle-item value="filters" ariaLabel="Filters">
          <i class="ph-bold ph-faders-horizontal"></i>
        </uc-button-toggle-item>
      </uc-button-toggle>
      <p style="margin-top: 1rem; color: var(--paragraph-text-color)">Selected value: {{ value }}</p>
    `,
  }),
};

export default meta;

type Story = StoryObj<UcButtonToggle>;

export const Default: Story = {};

export const DisabledGroup: Story = {
  args: {
    disabled: true,
  },
};
