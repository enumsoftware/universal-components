import {
  AfterViewInit,
  Component,
  input,
  signal,
  computed,
  contentChildren,
  viewChild,
  ElementRef,
  afterRenderEffect,
  afterEveryRender,
  afterNextRender,
  ChangeDetectionStrategy,
  Injector,
  OnDestroy,
  inject,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { UcSidebar, type UcSidebarSide } from './uc-sidebar/uc-sidebar';

export const SIDEBAR_MODE_OPTIONS = ['over', 'side'] as const;
export type UcSidebarMode = (typeof SIDEBAR_MODE_OPTIONS)[number];
export const SIDEBAR_VARIANT_OPTIONS = ['floating', 'flush'] as const;
export type UcSidebarVariant = (typeof SIDEBAR_VARIANT_OPTIONS)[number];
export const SIDEBAR_OVERLAY_SCOPE_OPTIONS = ['viewport', 'container'] as const;
export type UcSidebarOverlayScope = (typeof SIDEBAR_OVERLAY_SCOPE_OPTIONS)[number];

/** Gap between the `floating` over sidebar and the container edges. */
const FLOATING_INSET_PX = 16;
/** Arrow keys on a resizable edge change the width by this much; with Shift by four times as much. */
const RESIZE_STEP_PX = 16;

/** One sidebar's state. In `over` mode its overlay mounts first and slides in a frame later. */
class SidebarState {
  readonly open = signal<boolean>(false);
  readonly mounted = signal<boolean>(false);
  readonly visible = signal<boolean>(false);
  closeTimeoutId: number | null = null;
  /** In `container` scope: what had focus when the sidebar opened, to get it back on close. */
  returnFocus: HTMLElement | null = null;
}

@Component({
  selector: 'uc-side-navigation',
  imports: [OverlayModule, NgTemplateOutlet],
  templateUrl: './uc-side-navigation.html',
  styleUrl: './uc-side-navigation.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcSideNavigation implements AfterViewInit, OnDestroy {
  private static nextId = 0;
  private readonly start = new SidebarState();
  private readonly end = new SidebarState();
  public readonly instanceId = signal<string>('');
  public readonly sidebarMode = input<UcSidebarMode>('over');
  /** `floating` insets the over sidebar with rounded corners; `flush` sits it against the edges. */
  public readonly sidebarVariant = input<UcSidebarVariant>('floating');
  /**
   * Where an `over` sidebar and its backdrop go. `viewport` opens them in the CDK overlay, the backdrop over the whole
   * window; `container` keeps them inside this component, so the page around it stays visible and usable.
   */
  public readonly overlayScope = input<UcSidebarOverlayScope>('viewport');
  public readonly sidebarScrollable = input<boolean>(true);
  public readonly closeOnBackdropClick = input<boolean>(true);
  /**
   * Renders the content area as `<main>`. Turn it off when the page already has a main landmark, or shows
   * several side navigations at once: a document may only have one.
   */
  public readonly mainLandmark = input<boolean>(true);
  /** The start sidebar; the `*End*` signals below are the end sidebar's. */
  readonly isSidebarOpen = this.start.open;
  readonly isOverlayMounted = this.start.mounted;
  readonly isOverlayVisible = this.start.visible;
  readonly isEndSidebarOpen = this.end.open;
  readonly isEndOverlayMounted = this.end.mounted;
  readonly isEndOverlayVisible = this.end.visible;
  readonly layoutRoot = viewChild.required<ElementRef<HTMLElement>>('layoutRoot');
  private readonly containedStart = viewChild<ElementRef<HTMLElement>>('containedStart');
  private readonly containedEnd = viewChild<ElementRef<HTMLElement>>('containedEnd');
  private readonly injector = inject(Injector);

  /** An over sidebar kept inside the component: rendered here instead of in the CDK overlay. */
  readonly isContained = computed(() => this.sidebarMode() === 'over' && this.overlayScope() === 'container');
  /** A contained sidebar is showing: the content under its backdrop is out of reach meanwhile. */
  readonly isContainedOpen = computed(
    () => this.isContained() && (this.start.mounted() || this.end.mounted()),
  );

  private readonly sidebars = contentChildren(UcSidebar);
  readonly startSidebar = computed(() => this.sidebars().find((sidebar) => sidebar.side() !== 'end'));
  readonly endSidebar = computed(() => this.sidebars().find((sidebar) => sidebar.side() === 'end'));
  /** The side whose edge is being dragged; transitions are off meanwhile so the sidebar follows the pointer. */
  readonly resizingSide = signal<UcSidebarSide | null>(null);

  readonly overlayInsetPx = computed(() =>
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
  readonly endOverlayPositions = computed<ConnectedPosition[]>(() => [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: -this.overlayInsetPx(),
      offsetY: this.overlayInsetPx(),
    },
  ]);

  private readonly containerWidthPx = signal<number>(0);
  /** Rendered sidebar widths, so a resize edge can report a value before anything was dragged. */
  private readonly renderedWidthPx = {
    start: signal<number | undefined>(undefined),
    end: signal<number | undefined>(undefined),
  };
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

    // A focusable separator needs aria-valuenow, and an unset width leaves the width tokens in
    // charge, so the edge reports what the sidebar actually renders. An unchanged value is a no-op.
    afterEveryRender(() => {
      for (const side of ['start', 'end'] as const) {
        // By id rather than a view query: in over mode the sidebar renders in a CDK overlay.
        const aside = document.getElementById(this.sidebarId(side));
        this.renderedWidthPx[side].set(aside ? Math.round(aside.getBoundingClientRect().width) : undefined);
      }
    });

    afterRenderEffect(() => {
      const mode = this.sidebarMode();
      // A change of scope starts over too: the sidebar would otherwise be left mounted where it no longer renders.
      this.overlayScope();

      for (const state of [this.start, this.end]) {
        if (mode === 'side') {
          this.clearOverlayCloseTimeout(state);
          state.mounted.set(false);
          state.visible.set(false);
          state.open.set(true);
        } else if (mode === 'over') {
          state.open.set(false);
          state.mounted.set(false);
          state.visible.set(false);
        }
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
    this.clearOverlayCloseTimeout(this.start);
    this.clearOverlayCloseTimeout(this.end);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private stateOf(side: UcSidebarSide): SidebarState {
    return side === 'end' ? this.end : this.start;
  }

  sidebarOf(side: UcSidebarSide): UcSidebar | undefined {
    return side === 'end' ? this.endSidebar() : this.startSidebar();
  }

  /** aria-valuenow of a resize edge: the dragged width, else the width the tokens render. */
  edgeValueNow(side: UcSidebarSide): number | null {
    return this.sidebarOf(side)?.width() ?? this.renderedWidthPx[side]() ?? null;
  }

  sidebarId(side: UcSidebarSide): string {
    return side === 'end' ? `${this.instanceId()}-end` : this.instanceId();
  }

  /** A width the user set, for the layout's custom property; null leaves the width token in charge. */
  widthCss(side: UcSidebarSide): string | null {
    const width = this.sidebarOf(side)?.width();
    return width === undefined ? null : `${width}px`;
  }

  private clearOverlayCloseTimeout(state: SidebarState) {
    if (state.closeTimeoutId !== null) {
      window.clearTimeout(state.closeTimeoutId);
      state.closeTimeoutId = null;
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

  toggleSidebar(side: UcSidebarSide = 'start') {
    if (this.stateOf(side).open()) {
      this.closeSidebar(side);
      return;
    }

    this.openSidebar(side);
  }

  openSidebar(side: UcSidebarSide = 'start') {
    const state = this.stateOf(side);

    if (this.sidebarMode() === 'over') {
      // One over sidebar at a time: each brings its own backdrop.
      const other: UcSidebarSide = side === 'end' ? 'start' : 'end';
      if (this.stateOf(other).open()) {
        this.closeSidebar(other);
      }

      this.clearOverlayCloseTimeout(state);
      state.mounted.set(true);

      requestAnimationFrame(() => {
        state.visible.set(true);
      });

      state.open.set(true);

      if (this.isContained()) {
        this.moveFocusIn(side);
      }
      return;
    }

    state.open.set(true);
  }

  closeSidebar(side: UcSidebarSide = 'start') {
    const state = this.stateOf(side);

    if (this.sidebarMode() === 'over') {
      if (this.isContained() && state.open()) {
        this.restoreFocus(side);
      }

      state.open.set(false);
      state.visible.set(false);
      this.clearOverlayCloseTimeout(state);

      state.closeTimeoutId = window.setTimeout(() => {
        state.mounted.set(false);
        state.closeTimeoutId = null;
      }, this.getAnimationDurationMs());

      return;
    }

    state.open.set(false);
  }

  onOverlayBackdropClick(side: UcSidebarSide = 'start') {
    if (this.closeOnBackdropClick()) {
      this.closeSidebar(side);
    }
  }

  /** Escape closes the over sidebar, sliding out like any other close (the overlay's own Escape is off for that). */
  onOverlayKeydown(side: UcSidebarSide, event: KeyboardEvent) {
    if (event.key === 'Escape' && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      this.closeSidebar(side);
    }
  }

  /** The backdrop of the contained sidebars: one shows at a time, so it closes whichever is open. */
  onContainedBackdropClick() {
    this.onOverlayBackdropClick(this.end.open() ? 'end' : 'start');
  }

  /** Focus goes into the contained sidebar once it has rendered; it remembers what had focus before. */
  private moveFocusIn(side: UcSidebarSide) {
    const state = this.stateOf(side);
    const active = document.activeElement;
    state.returnFocus = active instanceof HTMLElement && active !== document.body ? active : null;

    afterNextRender(
      () => {
        const aside = (side === 'end' ? this.containedEnd() : this.containedStart())?.nativeElement;
        if (aside && !aside.contains(document.activeElement)) {
          aside.focus({ preventScroll: true });
        }
      },
      { injector: this.injector },
    );
  }

  /** Focus left in the closing sidebar goes back where it was before it opened. */
  private restoreFocus(side: UcSidebarSide) {
    const state = this.stateOf(side);
    const aside = (side === 'end' ? this.containedEnd() : this.containedStart())?.nativeElement;
    const target = state.returnFocus;
    state.returnFocus = null;
    const active = document.activeElement;
    const focusInside = !!aside && !!active && aside.contains(active);

    if (target?.isConnected && (focusInside || active === document.body || active === null)) {
      target.focus({ preventScroll: true });
    }
  }

  /** The overlay went away on its own (its scroll strategy, say): the sidebar counts as closed, so it can open again. */
  onOverlayDetach(side: UcSidebarSide) {
    const state = this.stateOf(side);
    this.clearOverlayCloseTimeout(state);
    state.open.set(false);
    state.visible.set(false);
    state.mounted.set(false);
  }

  /** Drags a resizable edge: the start sidebar grows towards the end, the end sidebar towards the start. */
  startResize(side: UcSidebarSide, event: PointerEvent) {
    const sidebar = this.sidebarOf(side);
    const handle = event.currentTarget as HTMLElement;
    const aside = handle.closest('aside');

    if (!sidebar?.resizable() || event.button !== 0 || !aside) {
      return;
    }

    event.preventDefault();
    handle.setPointerCapture?.(event.pointerId);
    const startX = event.clientX;
    const startWidth = aside.getBoundingClientRect().width;
    const direction = this.growDirection(side, aside);
    this.resizingSide.set(side);

    const move = (moveEvent: PointerEvent) => {
      this.setWidth(sidebar, startWidth + direction * (moveEvent.clientX - startX));
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      this.resizingSide.set(null);
    };

    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  /** Arrow keys resize, Home and End go to the narrowest and widest. The keys stop here, so the page does not see them. */
  keyResize(side: UcSidebarSide, event: KeyboardEvent) {
    const sidebar = this.sidebarOf(side);
    const handle = event.currentTarget as HTMLElement;
    const aside = handle.closest('aside');

    if (!sidebar?.resizable() || !aside) {
      return;
    }

    const step = event.shiftKey ? RESIZE_STEP_PX * 4 : RESIZE_STEP_PX;
    const grow = this.growDirection(side, aside);
    const current = sidebar.width() ?? aside.getBoundingClientRect().width;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      this.setWidth(sidebar, current + (event.key === 'ArrowRight' ? step : -step) * grow);
    } else if (event.key === 'Home' || event.key === 'End') {
      this.setWidth(sidebar, event.key === 'Home' ? sidebar.minWidth() : sidebar.maxWidth());
    } else {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  /** Back to the width token. */
  resetWidth(side: UcSidebarSide) {
    const sidebar = this.sidebarOf(side);

    if (sidebar?.resizable()) {
      sidebar.setUserWidth(undefined);
    }
  }

  private setWidth(sidebar: UcSidebar, width: number) {
    const containerWidth = this.containerWidthPx() || Number.POSITIVE_INFINITY;
    const max = Math.min(sidebar.maxWidth(), containerWidth);
    sidebar.setUserWidth(Math.round(Math.max(sidebar.minWidth(), Math.min(max, width))));
  }

  /** +1 when moving the pointer right widens the sidebar: the start one in left-to-right text, the end one in right-to-left. */
  private growDirection(side: UcSidebarSide, element: HTMLElement): 1 | -1 {
    const rtl = getComputedStyle(element).direction === 'rtl';
    return (side === 'start') !== rtl ? 1 : -1;
  }
}
