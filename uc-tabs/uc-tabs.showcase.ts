import { defineShowcase, object, text } from '../workbench/core';
import { TabsPreview } from './examples/tabs-preview';
import type { UcTab } from './uc-tabs';

const TABS: UcTab[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'details', label: 'Details' },
  { key: 'settings', label: 'Settings' },
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
  },
  examples: [{ name: 'Second Tab Active', props: { activeTab: 'details' } }],
});
