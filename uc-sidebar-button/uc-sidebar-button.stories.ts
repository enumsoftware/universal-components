import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcPhosphorIcon } from '../uc-phosphor-icon/uc-phosphor-icon';
import { UcSidebarButton, SIDEBAR_BUTTON_STYLE_OPTIONS } from './uc-sidebar-button';

const meta: Meta<UcSidebarButton> = {
  title: 'Components/Sidebar Button',
  component: UcSidebarButton,
  decorators: [
    moduleMetadata({
      imports: [UcPhosphorIcon],
    }),
  ],
  args: {
    text: 'Dashboard',
    active: false,
    style: 'primary',
  },
  argTypes: {
    style: {
      control: { type: 'select' },
      options: SIDEBAR_BUTTON_STYLE_OPTIONS,
    },
  },
};

export default meta;
type Story = StoryObj<UcSidebarButton>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <uc-sidebar-button [text]="text" [active]="active" [style]="style">
        <uc-phosphor-icon icon="house" />
      </uc-sidebar-button>
    `,
  }),
};

export const Active: Story = {
  args: {
    active: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-sidebar-button [text]="text" [active]="active" [style]="style">
        <uc-phosphor-icon icon="house" />
      </uc-sidebar-button>
    `,
  }),
};

export const Secondary: Story = {
  args: {
    style: 'secondary',
    text: 'Settings',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-sidebar-button [text]="text" [active]="active" [style]="style">
        <uc-phosphor-icon icon="gear" />
      </uc-sidebar-button>
    `,
  }),
};

export const WithoutIcon: Story = {
  args: { text: 'Reports' },
};

export const WithCustomSvg: Story = {
  args: {
    text: 'Custom',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-sidebar-button [text]="text" [active]="active" [style]="style">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 12h16" />
          <path d="M12 4v16" />
        </svg>
      </uc-sidebar-button>
    `,
  }),
};
