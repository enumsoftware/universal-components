import {
  Component,
  HostBinding,
  inject,
  input,
  signal,
  effect,
  computed,
  Renderer2,
  viewChild,
  ElementRef,
  afterRenderEffect,
  DOCUMENT,
} from '@angular/core';
import { UcSidebar } from './uc-sidebar/uc-sidebar';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgClass } from '@angular/common';

export type UcSidebarMode = 'over' | 'side';
@Component({
  selector: 'uc-side-navigation',
  templateUrl: './uc-side-navigation.html',
  styleUrl: './uc-side-navigation.scss',
  imports: [NgClass],
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

  private readonly sanitizer = inject(DomSanitizer);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.instanceId.set(`uc-side-navigation-${UcSideNavigation.nextId++}`);

    afterRenderEffect(() => {
      if (this.sidebarMode() === 'side') {
        this.isSidebarOpen.set(true);
      }

      if (this.sidebarMode() === 'over') {
        this.renderer.setAttribute(this.aside().nativeElement, 'popover', 'auto');
        this.isSidebarOpen.set(false);

        // Enable animations after initial render to prevent animation on page load
        setTimeout(() => {
          this.renderer.addClass(this.aside().nativeElement, 'animations-enabled');
        }, 100);
      }
    });
  }

  @HostBinding('style')
  get style(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`background-color: white;`);
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
