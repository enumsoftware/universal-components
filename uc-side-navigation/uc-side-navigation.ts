import {
  Component,
  inject,
  input,
  signal,
  computed,
  Renderer2,
  viewChild,
  ElementRef,
  afterRenderEffect,
  DOCUMENT,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UcSidebar } from './uc-sidebar/uc-sidebar';

export type UcSidebarMode = 'over' | 'side';
@Component({
  selector: 'uc-side-navigation',
  templateUrl: './uc-side-navigation.html',
  styleUrl: './uc-side-navigation.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcSideNavigation {
  private static nextId = 0;
  public readonly instanceId = signal<string>('');
  public readonly sidebarMode = input<UcSidebarMode>('over');
  readonly isSidebarOpen = signal<boolean>(false);
  readonly sidebarAnimationClass = computed(() =>
    this.isSidebarOpen() ? 'sidebar-opened' : 'sidebar-closed',
  );

  readonly aside = viewChild.required<ElementRef<HTMLElement>>('testAside');

  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private animationsEnabled = false;

  constructor() {
    this.instanceId.set(`uc-side-navigation-${UcSideNavigation.nextId++}`);

    afterRenderEffect(() => {
      const mode = this.sidebarMode();
      const asideEl = this.aside().nativeElement;

      if (mode === 'side') {
        if (asideEl.hasAttribute('popover')) {
          try {
            asideEl.hidePopover();
          } catch {}
          this.renderer.removeAttribute(asideEl, 'popover');
        }
        this.isSidebarOpen.set(true);
      } else if (mode === 'over') {
        if (!asideEl.hasAttribute('popover')) {
          this.renderer.setAttribute(asideEl, 'popover', 'auto');
        }
        this.isSidebarOpen.set(false);

        // Enable animations after initial render to prevent animation on page load
        if (!this.animationsEnabled) {
          this.animationsEnabled = true;
          setTimeout(() => {
            this.renderer.addClass(asideEl, 'animations-enabled');
          }, 100);
        }
      }
    });
  }



  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());

    if (this.sidebarMode() == 'over') {
      const sidebar = this.document.getElementById(this.instanceId());

      if (sidebar) {
        sidebar.togglePopover();
      }
    }
  }

  openSidebar() {
    this.isSidebarOpen.set(true);

    if (this.sidebarMode() == 'over') {
      const sidebar = this.document.getElementById(this.instanceId());

      if (sidebar) {
        sidebar.showPopover();
      }
    }
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);

    if (this.sidebarMode() == 'over') {
      const sidebar = this.document.getElementById(this.instanceId());

      if (sidebar) {
        sidebar.hidePopover();
      }
    }
  }
}
