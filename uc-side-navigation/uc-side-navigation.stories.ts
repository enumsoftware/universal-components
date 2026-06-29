import type { Meta, StoryObj } from '@storybook/angular';
import { UcSideNavigation } from './uc-side-navigation';

const meta: Meta<UcSideNavigation> = {
  title: 'Components/Side Navigation',
  component: UcSideNavigation,
  args: {
    sidebarMode: 'side',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 400px; position: relative;">
        <uc-side-navigation [sidebarMode]="sidebarMode">
          <uc-sidebar>
            <nav style="padding: 16px;">
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 8px;"><a href="#">Dashboard</a></li>
                <li style="margin-bottom: 8px;"><a href="#">Reports</a></li>
                <li style="margin-bottom: 8px;"><a href="#">Settings</a></li>
              </ul>
            </nav>
          </uc-sidebar>
          <div style="padding: 24px;">
            <h2>Main Content</h2>
            <p>This is the main content area.</p>
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
