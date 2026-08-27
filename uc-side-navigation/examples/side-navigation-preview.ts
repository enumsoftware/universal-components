import { Component, input } from '@angular/core';

import { UcIconButton } from '../../uc-icon-button/uc-icon-button';
import { UcPhosphorIcon } from '../../uc-phosphor-icon/uc-phosphor-icon';
import { UcSidebarButton } from '../../uc-sidebar-button/uc-sidebar-button';
import { UcSidebar } from '../uc-sidebar/uc-sidebar';
import { UcSideNavigation, type UcSidebarMode } from '../uc-side-navigation';

interface NavItem {
  readonly label: string;
  readonly icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'house' },
  { label: 'Reports', icon: 'chart-bar' },
  { label: 'Settings', icon: 'gear' },
  { label: 'Users', icon: 'users' },
  { label: 'Teams', icon: 'user-list' },
  { label: 'Invoices', icon: 'receipt' },
  { label: 'Subscriptions', icon: 'credit-card' },
  { label: 'Audit Log', icon: 'clipboard-text' },
  { label: 'Notifications', icon: 'bell' },
  { label: 'Integrations', icon: 'plugs' },
  { label: 'API Keys', icon: 'key' },
  { label: 'Security', icon: 'shield-check' },
  { label: 'Permissions', icon: 'lock-key' },
  { label: 'Data Export', icon: 'download-simple' },
  { label: 'Data Import', icon: 'upload-simple' },
  { label: 'Support', icon: 'lifebuoy' },
  { label: 'Help Center', icon: 'question' },
  { label: 'Changelog', icon: 'clock-counter-clockwise' },
];

/**
 * The component fills its parent rather than the viewport, so the preview
 * supplies the height. The long nav list is deliberate: it is what makes
 * `sidebarScrollable` observable.
 */
@Component({
  selector: 'uc-side-navigation-preview',
  imports: [UcSideNavigation, UcSidebar, UcSidebarButton, UcPhosphorIcon, UcIconButton],
  styleUrl: './side-navigation-preview.css',
  template: `
    <uc-side-navigation
      #sideNavigation
      [sidebarMode]="sidebarMode()"
      [sidebarScrollable]="sidebarScrollable()"
      [closeOnBackdropClick]="closeOnBackdropClick()"
    >
      <div ucSidebarHeader class="wb-sidebar-header">
        <strong>Workspace</strong>
        <uc-icon-button
          label="Close sidebar"
          phosphorIcon="x"
          variant="secondary"
          (clicked)="sideNavigation.closeSidebar()"
        />
      </div>

      <uc-sidebar>
        <nav class="wb-nav">
          @for (item of navItems; track item.label; let first = $first) {
            <uc-sidebar-button [text]="item.label" [active]="first">
              <uc-phosphor-icon [icon]="item.icon" />
            </uc-sidebar-button>
          }
        </nav>
      </uc-sidebar>

      <div ucSidebarFooter class="wb-sidebar-footer">
        <uc-sidebar-button text="Sign out" [active]="false">
          <uc-phosphor-icon icon="sign-out" />
        </uc-sidebar-button>
      </div>

      <div class="wb-main">
        <uc-icon-button
          label="Open sidebar"
          phosphorIcon="list"
          variant="secondary"
          (clicked)="sideNavigation.openSidebar()"
        />
        <h2>Main Content</h2>
        <p>This is the main content area.</p>

        <div class="wb-scroll-demo">
          <p class="wb-scroll-title">Scrollable Demo Container</p>
          @for (item of scrollItems; track item) {
            <p>{{ item }}</p>
          }
        </div>
      </div>
    </uc-side-navigation>
  `,
})
export class SideNavigationPreview {
  readonly sidebarMode = input<UcSidebarMode>('side');
  readonly sidebarScrollable = input<boolean>(true);
  readonly closeOnBackdropClick = input<boolean>(true);

  protected readonly navItems = NAV_ITEMS;
  protected readonly scrollItems = Array.from(
    { length: 11 },
    (_, index) => `Item ${String(index + 1).padStart(2, '0')} - demo content for overflow behaviour.`,
  );
}
