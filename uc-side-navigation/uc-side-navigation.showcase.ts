import { bool, defineShowcase, select } from '../workbench/core';
import { SideNavigationPreview } from './examples/side-navigation-preview';
import { SIDEBAR_MODE_OPTIONS } from './uc-side-navigation';

export default defineShowcase({
  id: 'components/side-navigation',
  group: 'Components',
  title: 'Side Navigation',
  layout: 'fullscreen',
  component: SideNavigationPreview,
  knobs: {
    sidebarMode: select(SIDEBAR_MODE_OPTIONS, 'side'),
    sidebarScrollable: bool(true),
    closeOnBackdropClick: bool(true),
  },
  examples: [{ name: 'Over Mode', props: { sidebarMode: 'over' } }],
});
