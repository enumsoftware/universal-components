import { bool, defineShowcase, select } from '../workbench/core';
import { SideNavigationPreview } from './examples/side-navigation-preview';
import { SIDEBAR_MODE_OPTIONS, SIDEBAR_VARIANT_OPTIONS } from './uc-side-navigation';

export default defineShowcase({
  id: 'components/side-navigation',
  group: 'Components',
  title: 'Side Navigation',
  layout: 'fullscreen',
  component: SideNavigationPreview,
  knobs: {
    sidebarMode: select(SIDEBAR_MODE_OPTIONS, 'side'),
    sidebarVariant: select(SIDEBAR_VARIANT_OPTIONS, 'floating'),
    sidebarScrollable: bool(true),
    closeOnBackdropClick: bool(true),
  },
  examples: [
    { name: 'Over Mode', props: { sidebarMode: 'over' } },
    { name: 'Over Mode, Flush', props: { sidebarMode: 'over', sidebarVariant: 'flush' } },
  ],
});
