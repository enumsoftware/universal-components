import { defineShowcase, object, select, text } from '../workbench/core';
import { ClosableTabsExample } from './examples/closable-tabs';
import { ManyTabsExample } from './examples/many-tabs';
import { TabsPreview } from './examples/tabs-preview';
import { TABS_VARIANT_OPTIONS, type UcTab } from './uc-tabs';

const TABS: UcTab[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'details', label: 'Details', closable: true },
  { key: 'settings', label: 'Settings', closable: true },
];

export default defineShowcase({
  id: 'components/tabs',
  group: 'Components',
  title: 'Tabs',
  layout: 'padded',
  component: TabsPreview,
  knobs: {
    tabs: object(TABS),
    activeTab: text('overview'),
    variant: select(TABS_VARIANT_OPTIONS, 'underline'),
  },
  examples: [
    { name: 'Second Tab Active', props: { activeTab: 'details' } },
    { name: 'Pills', props: { variant: 'pills' } },
    {
      name: 'Disabled Tab',
      description: 'A tab with `disabled: true` stays visible but ignores clicks.',
      props: {
        tabs: [
          { key: 'overview', label: 'Overview' },
          { key: 'details', label: 'Details', disabled: true },
          { key: 'settings', label: 'Settings' },
        ],
      },
    },
    {
      name: 'Hidden Tab',
      description: 'A tab with `visible: false` is not rendered, and neither is its panel.',
      props: {
        tabs: [
          { key: 'overview', label: 'Overview' },
          { key: 'details', label: 'Details', visible: false },
          { key: 'settings', label: 'Settings' },
        ],
      },
    },
    {
      name: 'Closable Tabs',
      description:
        'A tab with `closable: true` gets a close button, and Delete closes it from the keyboard. `tabClose` emits the key; the host removes the tab.',
      component: ClosableTabsExample,
    },
    {
      name: 'Many Tabs',
      description:
        'Tabs that overflow scroll with arrows on desktop and collapse into a dropdown under 768px.',
      component: ManyTabsExample,
    },
  ],
});
