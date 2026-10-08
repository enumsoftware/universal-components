import {
  AfterViewInit,
  Component,
  input,
  signal,
  computed,
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
export const SIDEBAR_VARIANT_OPTIONS = ['floating', 'flush'] as const;
export type UcSidebarVariant = (typeof SIDEBAR_VARIANT_OPTIONS)[number];

/** Gap between the `floating` over sidebar and the container edges. */
const FLOATING_INSET_PX = 16;

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
  /** `floating` insets the over sidebar with rounded corners; `flush` sits it against the edges. */
  public readonly sidebarVariant = input<UcSidebarVariant>('floating');
  public readonly sidebarScrollable = input<boolean>(true);
  public readonly closeOnBackdropClick = input<boolean>(true);
  readonly isSidebarOpen = signal<boolean>(false);
  readonly isOverlayMounted = signal<boolean>(false);
  readonly isOverlayVisible = signal<boolean>(false);
  readonly layoutRoot = viewChild.required<ElementRef<HTMLElement>>('layoutRoot');
  private readonly overlayInsetPx = computed(() =>
    this.sidebarVariant() === 'flush' ? 0 : FLOATING_INSET_PX,
  );
  readonly overlayPositions = computed<ConnectedPosition[]>(() => [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: this.overlayInsetPx(),
      offsetY: this.overlayInsetPx(),
    },
  ]);

  private readonly containerWidthPx = signal<number>(0);
  private readonly containerHeightPx = signal<number>(0);
  private resizeObserver: ResizeObserver | null = null;

  readonly overlayHeightPx = computed(() =>
    Math.max(this.containerHeightPx() - this.overlayInsetPx() * 2, 0),
  );
  readonly overlayMaxWidthPx = computed(() =>
    Math.max(this.containerWidthPx() - this.overlayInsetPx() * 2, 0),
  );

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
