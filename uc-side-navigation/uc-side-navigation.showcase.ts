import { bool, defineShowcase, select } from '../workbench/core';
import { SideNavigationPreview } from './examples/side-navigation-preview';
import { SIDEBAR_MODE_OPTIONS, SIDEBAR_OVERLAY_SCOPE_OPTIONS, SIDEBAR_VARIANT_OPTIONS } from './uc-side-navigation';
import { SIDEBAR_EDGE_OPTIONS } from './uc-sidebar/uc-sidebar';

export default defineShowcase({
  id: 'components/side-navigation',
  group: 'Components',
  title: 'Side Navigation',
  layout: 'fullscreen',
  component: SideNavigationPreview,
  knobs: {
    sidebarMode: select(SIDEBAR_MODE_OPTIONS, 'side'),
    sidebarVariant: select(SIDEBAR_VARIANT_OPTIONS, 'floating'),
    overlayScope: select(SIDEBAR_OVERLAY_SCOPE_OPTIONS, 'viewport'),
    sidebarScrollable: bool(true),
    closeOnBackdropClick: bool(true),
    endSidebar: bool(false),
    edge: select(SIDEBAR_EDGE_OPTIONS, 'line'),
    resizable: bool(false),
  },
  examples: [
    { name: 'Over Mode', props: { sidebarMode: 'over' } },
    { name: 'Over Mode, Flush', props: { sidebarMode: 'over', sidebarVariant: 'flush' } },
    { name: 'Over Mode, Contained', props: { sidebarMode: 'over', overlayScope: 'container', endSidebar: true } },
    { name: 'Both Sides, Resizable', props: { endSidebar: true, resizable: true } },
    { name: 'Resizable With Grip', props: { resizable: true, edge: 'grip' } },
  ],
});
