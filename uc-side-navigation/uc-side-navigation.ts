import {
  AfterViewInit,
  Component,
  input,
  signal,
  viewChild,
  ElementRef,
  afterRenderEffect,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

export const SIDEBAR_MODE_OPTIONS = ['over', 'side'] as const;
export type UcSidebarMode = (typeof SIDEBAR_MODE_OPTIONS)[number];
@Component({
  selector: 'uc-side-navigation',
  imports: [OverlayModule, NgTemplateOutlet],
  templateUrl: './uc-side-navigation.html',
  styleUrl: './uc-side-navigation.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcSideNavigation implements AfterViewInit, OnDestroy {
  private static nextId = 0;
  private overlayCloseTimeoutId: number | null = null;
  public readonly instanceId = signal<string>('');
  public readonly sidebarMode = input<UcSidebarMode>('over');
  public readonly sidebarScrollable = input<boolean>(true);
  public readonly closeOnBackdropClick = input<boolean>(true);
  readonly isSidebarOpen = signal<boolean>(false);
  readonly isOverlayMounted = signal<boolean>(false);
  readonly isOverlayVisible = signal<boolean>(false);
  readonly layoutRoot = viewChild.required<ElementRef<HTMLElement>>('layoutRoot');
  readonly overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 16,
      offsetY: 16,
    },
  ];

  private readonly containerWidthPx = signal<number>(0);
  private readonly containerHeightPx = signal<number>(0);
  private resizeObserver: ResizeObserver | null = null;

  readonly overlayHeightPx = signal<number>(0);
  readonly overlayMaxWidthPx = signal<number>(0);

  constructor() {
    this.instanceId.set(`uc-side-navigation-${UcSideNavigation.nextId++}`);

    afterRenderEffect(() => {
      const mode = this.sidebarMode();

      if (mode === 'side') {
        this.clearOverlayCloseTimeout();
        this.isOverlayMounted.set(false);
        this.isOverlayVisible.set(false);
        this.isSidebarOpen.set(true);
      } else if (mode === 'over') {
        this.isSidebarOpen.set(false);
        this.isOverlayMounted.set(false);
        this.isOverlayVisible.set(false);
      }
    });
  }

  ngAfterViewInit() {
    const host = this.layoutRoot().nativeElement;
    this.updateContainerSize(host);

    this.resizeObserver = new ResizeObserver(() => {
      this.updateContainerSize(host);
    });

    this.resizeObserver.observe(host);
  }

  ngOnDestroy() {
    this.clearOverlayCloseTimeout();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private clearOverlayCloseTimeout() {
    if (this.overlayCloseTimeoutId !== null) {
      window.clearTimeout(this.overlayCloseTimeoutId);
      this.overlayCloseTimeoutId = null;
    }
  }

  private getAnimationDurationMs(): number {
    const host = this.layoutRoot().nativeElement;
    const value = getComputedStyle(host)
      .getPropertyValue('--uc-side-navigation-animation-duration')
      .trim();

    if (!value) {
      return 300;
    }

    if (value.endsWith('ms')) {
      const ms = Number.parseFloat(value);
      return Number.isFinite(ms) ? ms : 300;
    }

    if (value.endsWith('s')) {
      const seconds = Number.parseFloat(value);
      return Number.isFinite(seconds) ? seconds * 1000 : 300;
    }

    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 300;
  }

  private updateContainerSize(host: HTMLElement) {
    const rect = host.getBoundingClientRect();
    this.containerWidthPx.set(rect.width);
    this.containerHeightPx.set(rect.height);
    this.overlayHeightPx.set(Math.max(rect.height - 32, 0));
    this.overlayMaxWidthPx.set(Math.max(rect.width - 32, 0));
  }

  toggleSidebar() {
    if (this.isSidebarOpen()) {
      this.closeSidebar();
      return;
    }

    this.openSidebar();
  }

  openSidebar() {
    if (this.sidebarMode() === 'over') {
      this.clearOverlayCloseTimeout();
      this.isOverlayMounted.set(true);

      requestAnimationFrame(() => {
        this.isOverlayVisible.set(true);
      });

      this.isSidebarOpen.set(true);
      return;
    }

    this.isSidebarOpen.set(true);
  }

  closeSidebar() {
    if (this.sidebarMode() === 'over') {
      this.isSidebarOpen.set(false);
      this.isOverlayVisible.set(false);
      this.clearOverlayCloseTimeout();

      this.overlayCloseTimeoutId = window.setTimeout(() => {
        this.isOverlayMounted.set(false);
        this.overlayCloseTimeoutId = null;
      }, this.getAnimationDurationMs());

      return;
    }

    this.isSidebarOpen.set(false);
  }

  onOverlayBackdropClick() {
    if (this.closeOnBackdropClick()) {
      this.closeSidebar();
    }
  }
}
