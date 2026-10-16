import { Component, input } from '@angular/core';

import { UcIconButton } from '../../uc-icon-button/uc-icon-button';
import { UcPhosphorIcon } from '../../uc-phosphor-icon/uc-phosphor-icon';
import { UcSidebarButton } from '../../uc-sidebar-button/uc-sidebar-button';
import { UcSidebar, type UcSidebarEdge } from '../uc-sidebar/uc-sidebar';
import {
  UcSideNavigation,
  type UcSidebarMode,
  type UcSidebarOverlayScope,
  type UcSidebarVariant,
} from '../uc-side-navigation';

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
      [sidebarVariant]="sidebarVariant()"
      [overlayScope]="overlayScope()"
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

      <uc-sidebar [edge]="edge()" [resizable]="resizable()" resizeLabel="Resize navigation">
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

      @if (endSidebar()) {
        <div ucEndSidebarHeader class="wb-sidebar-header">
          <strong>Details</strong>
          <uc-icon-button
            label="Close details"
            phosphorIcon="x"
            variant="secondary"
            (clicked)="sideNavigation.closeSidebar('end')"
          />
        </div>
      }

      @if (endSidebar()) {
        <uc-sidebar side="end" [edge]="edge()" [resizable]="resizable()" resizeLabel="Resize details">
          <div class="wb-details">
            <p>A second sidebar on the end side, with its own header, width and edge.</p>
          </div>
        </uc-sidebar>
      }

      <div class="wb-main">
        <uc-icon-button
          label="Open sidebar"
          phosphorIcon="list"
          variant="secondary"
          (clicked)="sideNavigation.openSidebar()"
        />
        @if (endSidebar()) {
          <uc-icon-button
            label="Open details"
            phosphorIcon="sidebar-simple"
            variant="secondary"
            (clicked)="sideNavigation.openSidebar('end')"
          />
        }
        <h2>Main Content</h2>
        <p>This is the main content area.</p>

        <!-- Focusable so the scroll container is reachable without a mouse. -->
        <div class="wb-scroll-demo" tabindex="0">
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
  readonly sidebarVariant = input<UcSidebarVariant>('floating');
  readonly overlayScope = input<UcSidebarOverlayScope>('viewport');
  readonly sidebarScrollable = input<boolean>(true);
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly endSidebar = input<boolean>(false);
  readonly edge = input<UcSidebarEdge>('line');
  readonly resizable = input<boolean>(false);

  protected readonly navItems = NAV_ITEMS;
  protected readonly scrollItems = Array.from(
    { length: 11 },
    (_, index) => `Item ${String(index + 1).padStart(2, '0')} - demo content for overflow behaviour.`,
  );
}
