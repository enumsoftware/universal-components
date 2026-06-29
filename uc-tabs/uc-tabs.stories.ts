import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcTabs, UcTabPanel } from './uc-tabs';

const meta: Meta<UcTabs> = {
  title: 'Components/Tabs',
  component: UcTabs,
  decorators: [
    moduleMetadata({
      imports: [UcTabPanel],
    }),
  ],
  args: {
    tabs: [
      { key: 'overview', label: 'Overview' },
      { key: 'details', label: 'Details' },
      { key: 'settings', label: 'Settings' },
    ],
    activeTab: 'overview',
  },
  render: (args) => ({
    props: args,
    template: `
      <uc-tabs [tabs]="tabs" [activeTab]="activeTab">
        <ng-template [ucTabPanel]="'overview'">
          <p>Overview content goes here.</p>
        </ng-template>
        <ng-template [ucTabPanel]="'details'">
          <p>Details content goes here.</p>
        </ng-template>
        <ng-template [ucTabPanel]="'settings'">
          <p>Settings content goes here.</p>
        </ng-template>
      </uc-tabs>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcTabs>;

export const Default: Story = {};

export const SecondTabActive: Story = {
  args: {
    activeTab: 'details',
  },
};
