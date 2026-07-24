import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { SIDEBAR_MODE_OPTIONS, UcSideNavigation } from "./uc-side-navigation";
import { UcSidebar } from "./uc-sidebar/uc-sidebar";
import { UcSidebarButton } from "../uc-sidebar-button/uc-sidebar-button";
import { UcPhosphorIcon } from "../uc-phosphor-icon/uc-phosphor-icon";
import { UcIconButton } from "../uc-icon-button/uc-icon-button";

const meta: Meta<UcSideNavigation> = {
  title: "Components/Side Navigation",
  component: UcSideNavigation,
  parameters: {
    docs: {
      description: {
        component:
          "The component now sizes itself from its parent container. Set a height on any parent wrapper (for example 400px, 60vh, or via container query) and `uc-side-navigation` will fill that height without using viewport units. In side mode, closed navigation is fully hidden and non-interactive (no pointer or focus interactions).",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UcSidebar, UcSidebarButton, UcPhosphorIcon, UcIconButton],
    }),
  ],
  args: {
    sidebarMode: "side",
    sidebarScrollable: true,
    closeOnBackdropClick: true,
  },
  argTypes: {
    sidebarMode: {
      control: { type: "select" },
      options: SIDEBAR_MODE_OPTIONS,
    },
    sidebarScrollable: {
      control: { type: "boolean" },
    },
    closeOnBackdropClick: {
      control: { type: "boolean" },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 100dvh; margin: 0 auto;">
        <uc-side-navigation
          [sidebarMode]="sidebarMode"
          [sidebarScrollable]="sidebarScrollable"
          [closeOnBackdropClick]="closeOnBackdropClick"
          #sideNavigation
        >
          <div
            ucSidebarHeader
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 12px 8px;
              border-bottom: 1px solid oklch(from var(--foreground-color) l c h / 0.15);
            "
          >
            <strong style="font-size: 0.875rem; color: var(--font-color);">Workspace</strong>
            <uc-icon-button
              [label]="'Close sidebar'"
              [phosphorIcon]="'x'"
              [variant]="'secondary'"
              (clicked)="sideNavigation.closeSidebar()"
            />
          </div>

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
              <uc-sidebar-button text="Users" [active]="false">
                <uc-phosphor-icon icon="users" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Teams" [active]="false">
                <uc-phosphor-icon icon="user-list" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Invoices" [active]="false">
                <uc-phosphor-icon icon="receipt" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Subscriptions" [active]="false">
                <uc-phosphor-icon icon="credit-card" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Audit Log" [active]="false">
                <uc-phosphor-icon icon="clipboard-text" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Notifications" [active]="false">
                <uc-phosphor-icon icon="bell" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Integrations" [active]="false">
                <uc-phosphor-icon icon="plugs" />
              </uc-sidebar-button>
              <uc-sidebar-button text="API Keys" [active]="false">
                <uc-phosphor-icon icon="key" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Security" [active]="false">
                <uc-phosphor-icon icon="shield-check" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Permissions" [active]="false">
                <uc-phosphor-icon icon="lock-key" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Data Export" [active]="false">
                <uc-phosphor-icon icon="download-simple" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Data Import" [active]="false">
                <uc-phosphor-icon icon="upload-simple" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Support" [active]="false">
                <uc-phosphor-icon icon="lifebuoy" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Help Center" [active]="false">
                <uc-phosphor-icon icon="question" />
              </uc-sidebar-button>
              <uc-sidebar-button text="Changelog" [active]="false">
                <uc-phosphor-icon icon="clock-counter-clockwise" />
              </uc-sidebar-button>
            </nav>
          </uc-sidebar>

          <div
            ucSidebarFooter
            style="
              padding: 8px 12px 12px;
              border-top: 1px solid oklch(from var(--foreground-color) l c h / 0.15);
            "
          >
            <uc-sidebar-button text="Sign out" [active]="false">
              <uc-phosphor-icon icon="sign-out" />
            </uc-sidebar-button>
          </div>

          <div style="padding: 24px;">
            <div style="display: flex; justify-content: flex-start; margin-bottom: 16px;">
              <uc-icon-button
                [label]="'Open sidebar'"
                [phosphorIcon]="'list'"
                [variant]="'secondary'"
                (clicked)="sideNavigation.openSidebar()"
              />
            </div>
            <h2 style="margin: 0 0 8px; font-family: var(--uc-font-family); font-size: 1.5rem; font-weight: 700; color: var(--font-color);">Main Content</h2>
            <p style="margin: 0; color: var(--font-color);">This is the main content area.</p>

            <div
              style="
                margin-top: 16px;
                max-height: 180px;
                overflow-y: auto;
                border: 1px solid oklch(from var(--foreground-color) l c h / 0.2);
                border-radius: 8px;
                padding: 12px;
                background: oklch(from var(--background-color) calc(l * 0.96) c h);
              "
            >
              <p style="margin: 0 0 8px; font-weight: 600;">Scrollable Demo Container</p>
              <p style="margin: 0 0 8px;">Item 01 - This block is intentionally scrollable.</p>
              <p style="margin: 0 0 8px;">Item 02 - Use it to inspect scrollbar styling.</p>
              <p style="margin: 0 0 8px;">Item 03 - It should pick up the global theme scrollbar.</p>
              <p style="margin: 0 0 8px;">Item 04 - Keep scrolling to the bottom.</p>
              <p style="margin: 0 0 8px;">Item 05 - Additional content for overflow behavior.</p>
              <p style="margin: 0 0 8px;">Item 06 - Additional content for overflow behavior.</p>
              <p style="margin: 0 0 8px;">Item 07 - Additional content for overflow behavior.</p>
              <p style="margin: 0 0 8px;">Item 08 - Additional content for overflow behavior.</p>
              <p style="margin: 0 0 8px;">Item 09 - Additional content for overflow behavior.</p>
              <p style="margin: 0 0 8px;">Item 10 - Additional content for overflow behavior.</p>
              <p style="margin: 0;">Item 11 - End of demo content.</p>
            </div>
          </div>
        </uc-side-navigation>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcSideNavigation>;

export const SideMode: Story = {
  parameters: {
    layout: "fullscreen",
  },
};

export const OverMode: Story = {
  args: {
    sidebarMode: "over",
  },
  parameters: {
    layout: "fullscreen",
  },
};
