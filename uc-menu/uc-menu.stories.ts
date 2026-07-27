import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcButton } from '../uc-button/uc-button';
import { UcMenu } from './uc-menu';
import { UcMenuItemComponent } from './uc-menu-item-component';
import { UcMenuItem } from './uc-menu-item';
import { UcMenuTriggerFor } from './uc-menu-trigger-for';

const meta: Meta<UcMenu> = {
  title: 'Components/Menu',
  component: UcMenu,
  decorators: [
    moduleMetadata({
      imports: [UcButton, UcMenu, UcMenuItemComponent, UcMenuTriggerFor, UcMenuItem],
    }),
  ],
  render: () => ({
    template: `
      <div style="padding: 3rem; display: flex; justify-content: center;">
        <uc-button [text]="'Actions'" [ucMenuTriggerFor]="menu"></uc-button>

        <uc-menu #menu="ucMenu">
          <uc-menu-item text="View profile" icon="ph ph-user"></uc-menu-item>
          <uc-menu-item text="Settings" icon="ph ph-gear"></uc-menu-item>
          <uc-menu-item text="Remove" icon="ph ph-trash" [disabled]="true"></uc-menu-item>
        </uc-menu>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcMenu>;

export const Default: Story = {};

export const WithNativeButtonTrigger: Story = {
  render: () => ({
    template: `
      <div style="padding: 3rem; display: flex; justify-content: center;">
        <button type="button" [ucMenuTriggerFor]="menu" style="padding: .6rem 1rem; border-radius: .5rem; border: 1px solid #ccc;">
          Open menu
        </button>

        <uc-menu #menu="ucMenu">
          <button type="button" ucMenuItem>Duplicate</button>
          <button type="button" ucMenuItem>Archive</button>
          <button type="button" ucMenuItem>Export</button>
        </uc-menu>
      </div>
    `,
  }),
};

export const WithDirectiveItems: Story = {
  render: () => ({
    template: `
      <div style="padding: 3rem; display: flex; justify-content: center;">
        <uc-button [text]="'More options'" [ucMenuTriggerFor]="menu"></uc-button>

        <uc-menu #menu="ucMenu">
          <button type="button" ucMenuItem>
            <i class="ph ph-copy"></i>
            Duplicate
          </button>
          <button type="button" ucMenuItem>
            <i class="ph ph-download-simple"></i>
            Download
          </button>
        </uc-menu>
      </div>
    `,
  }),
};
