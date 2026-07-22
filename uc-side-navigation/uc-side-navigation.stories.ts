import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcSideNavigation } from './uc-side-navigation';
import { UcSidebar } from './uc-sidebar/uc-sidebar';
import { UcSidebarButton } from '../uc-sidebar-button/uc-sidebar-button';
import { UcPhosphorIcon } from '../uc-phosphor-icon/uc-phosphor-icon';

const meta: Meta<UcSideNavigation> = {
  title: 'Components/Side Navigation',
  component: UcSideNavigation,
  decorators: [
    moduleMetadata({
      imports: [UcSidebar, UcSidebarButton, UcPhosphorIcon],
    }),
  ],
  args: {
    sidebarMode: 'side',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 400px; position: relative;">
        <uc-side-navigation [sidebarMode]="sidebarMode">
          <uc-sidebar>
            <nav style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
              <uc-sidebar-button text="Dashboard" [active]="true">
                <uc-phosphor-icon icon="house" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Reports" [active]="false">
                <uc-phosphor-icon icon="chart-bar" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Settings" [active]="false">
                <uc-phosphor-icon icon="gear" />
              </uc-sidebar-button>
            </nav>
          </uc-sidebar>
          <div style="padding: 24px;">
            <h2 style="margin: 0 0 8px; font-family: var(--uc-font-family); font-size: 1.5rem; font-weight: 700; color: var(--font-color);">Main Content</h2>
            <p style="margin: 0; color: var(--font-color);">This is the main content area.</p>
          </div>
        </uc-side-navigation>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcSideNavigation>;

export const SideMode: Story = {};

export const OverMode: Story = {
  args: {
    sidebarMode: 'over',
  },
};
