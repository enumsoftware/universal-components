import {
  Component,
  inject,
  input,
  signal,
  Renderer2,
  viewChild,
  ElementRef,
  afterRenderEffect,
  ChangeDetectionStrategy,
} from '@angular/core';

export const SIDEBAR_MODE_OPTIONS = ['over', 'side'] as const;
export type UcSidebarMode = (typeof SIDEBAR_MODE_OPTIONS)[number];
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
  public readonly sidebarScrollable = input<boolean>(true);
  public readonly closeOnBackdropClick = input<boolean>(true);
  readonly isSidebarOpen = signal<boolean>(false);

  readonly aside = viewChild.required<ElementRef<HTMLElement>>('sidebarAside');

  private readonly renderer = inject(Renderer2);
  private animationsEnabled = false;

  constructor() {
    this.instanceId.set(`uc-side-navigation-${UcSideNavigation.nextId++}`);

    afterRenderEffect(() => {
      const mode = this.sidebarMode();
      const asideEl = this.aside().nativeElement;

      if (mode === 'side') {
        this.isSidebarOpen.set(true);
      } else if (mode === 'over') {
        this.isSidebarOpen.set(false);

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
  }

  openSidebar() {
    this.isSidebarOpen.set(true);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}
