import { bool, defineShowcase, select, text } from '../workbench/core';
import { SIDEBAR_BUTTON_STYLE_OPTIONS } from './uc-sidebar-button';
import { SidebarButtonCustomSvgExample } from './examples/custom-svg';
import { SidebarButtonPreview } from './examples/sidebar-button-preview';

export default defineShowcase({
  id: 'components/sidebar-button',
  group: 'Components',
  title: 'Sidebar Button',
  layout: 'padded',
  component: SidebarButtonPreview,
  knobs: {
    text: text('Dashboard'),
    active: bool(false),
    style: select(SIDEBAR_BUTTON_STYLE_OPTIONS, 'primary'),
    icon: text('house', { description: 'Leave empty to render without an icon.' }),
  },
  examples: [
    { name: 'Active', props: { active: true } },
    { name: 'Secondary', props: { style: 'secondary', text: 'Settings', icon: 'gear' } },
    { name: 'Without Icon', props: { text: 'Reports', icon: '' } },
    { name: 'With Custom Svg', component: SidebarButtonCustomSvgExample },
  ],
});
