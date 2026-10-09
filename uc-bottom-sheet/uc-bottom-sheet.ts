import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

/** A sheet height: px as a number or `'120px'`, `'5rem'`, or `'50%'` of the container (or viewport when fixed). */
export type UcBottomSheetSnapPoint = number | `${number}px` | `${number}rem` | `${number}%`;

/** Pointer travel (px) before a press on the handle or header becomes a drag rather than a click. */
const DRAG_THRESHOLD = 4;
/** Release speed (px/ms) from which a drag is a flick to the next snap point instead of to the nearest. */
const FLICK_VELOCITY = 0.4;

/**
 * A non-modal sheet that sits in the page, over the bottom of its container, and is dragged between snap
 * heights - the list over a map in a maps app. Everything outside it stays usable, and nothing traps focus.
 * For a modal action sheet, open one through `UcBottomSheetService` instead.
 */
@Component({
  selector: 'uc-bottom-sheet',
  templateUrl: './uc-bottom-sheet.html',
  styleUrl: './uc-bottom-sheet.css',
  host: {
    '[attr.role]': 'label() ? "region" : null',
    '[attr.aria-label]': 'label() || null',
    '[class.uc-bottom-sheet--fixed]': 'fixed()',
    '[class.uc-bottom-sheet--dragging]': 'dragging()',
    '[style.height.px]': 'height()',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcBottomSheet {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  /** Heights the sheet rests at, lowest first. Percentages are of the container, or the viewport when fixed. */
  readonly snapPoints = input<readonly UcBottomSheetSnapPoint[]>(['5rem', '50%', '90%']);
  /** Index into `snapPoints` the sheet rests at. Two-way: dragging and the keyboard update it. */
  readonly snapIndex = model<number>(0);
  /** Accessible name; makes the sheet a named region landmark, e.g. "Bus lines". */
  readonly label = input<string>('');
  /** Accessible name of the drag handle, which is a vertical slider for keyboard and screen reader users. */
  readonly handleLabel = input<string>('Sheet height');
  /** Announced name of each snap point, e.g. `['Collapsed', 'Half', 'Expanded']`. Defaults to "n of m". */
  readonly snapLabels = input<readonly string[]>([]);
  /** Pins the sheet to the bottom of the viewport instead of its positioned container. */
  readonly fixed = input<boolean>(false);

  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');

  private readonly containerHeight = signal(0);
  private readonly rootFontSize = signal(16);
  private readonly dragHeight = signal<number | null>(null);

  readonly dragging = computed(() => this.dragHeight() !== null);

  readonly snapHeights = computed(() =>
    this.snapPoints().map((point) => resolveSnapPoint(point, this.containerHeight(), this.rootFontSize())),
  );

  readonly currentIndex = computed(() => clamp(this.snapIndex(), 0, Math.max(this.snapPoints().length - 1, 0)));

  readonly height = computed(() => this.dragHeight() ?? this.snapHeights()[this.currentIndex()] ?? 0);

  readonly valueText = computed(() => {
    const index = this.currentIndex();
    return this.snapLabels()[index] ?? `${index + 1} of ${this.snapPoints().length}`;
  });

  private press: {
    pointerId: number;
    startY: number;
    startHeight: number;
    lastY: number;
    lastTime: number;
    velocity: number;
  } | null = null;
  /** Set when a press turned into a drag, so the click that follows it does not also cycle the height. */
  private suppressClick = false;

  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      const fontSize = view ? parseFloat(view.getComputedStyle(this.document.documentElement).fontSize) : NaN;
      if (!Number.isNaN(fontSize)) {
        this.rootFontSize.set(fontSize);
      }

      const parent = this.host.nativeElement.parentElement;
      const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => this.measure());
      if (parent) {
        observer?.observe(parent);
      }
      const onResize = () => this.measure();
      view?.addEventListener('resize', onResize);

      this.destroyRef.onDestroy(() => {
        observer?.disconnect();
        view?.removeEventListener('resize', onResize);
      });
    });

    // Re-measures on first render and whenever `fixed` switches what the percentages are of.
    afterRenderEffect(() => {
      this.fixed();
      this.measure();
    });
  }

  /** Moves to a snap point by index, clamped to the ones there are. */
  snapTo(index: number): void {
    this.snapIndex.set(clamp(index, 0, this.snapPoints().length - 1));
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0 || this.press) {
      return;
    }

    this.press = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: this.height(),
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocity: 0,
    };
    this.suppressClick = false;
  }

  onPointerMove(event: PointerEvent): void {
    const press = this.press;
    if (!press || event.pointerId !== press.pointerId) {
      return;
    }

    if (!this.dragging()) {
      if (Math.abs(event.clientY - press.startY) < DRAG_THRESHOLD) {
        return;
      }
      // Capture only once it is a drag: capturing on press would retarget the click of a button in the header.
      (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
      this.suppressClick = true;
    }

    const elapsed = event.timeStamp - press.lastTime;
    if (elapsed > 0) {
      press.velocity = (press.lastY - event.clientY) / elapsed;
    }
    press.lastY = event.clientY;
    press.lastTime = event.timeStamp;

    const heights = this.snapHeights();
    const min = Math.min(...heights);
    const max = Math.max(...heights);
    this.dragHeight.set(clamp(press.startHeight + press.startY - event.clientY, min, max));
  }

  onPointerUp(event: PointerEvent): void {
    const press = this.press;
    if (!press || event.pointerId !== press.pointerId) {
      return;
    }

    this.press = null;
    const height = this.dragHeight();
    if (height === null) {
      return;
    }

    this.snapIndex.set(this.settleIndex(height, press.velocity));
    this.dragHeight.set(null);
  }

  onPointerCancel(): void {
    this.press = null;
    this.dragHeight.set(null);
  }

  /** A click (not a drag) on the handle steps up through the snap points and wraps back to the lowest. */
  onHandleClick(): void {
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }

    const next = this.currentIndex() + 1;
    this.snapTo(next < this.snapPoints().length ? next : 0);
  }

  onHandleKeydown(event: KeyboardEvent): void {
    const index = this.currentIndex();
    const last = this.snapPoints().length - 1;
    const target = {
      ArrowUp: index + 1,
      ArrowRight: index + 1,
      PageUp: index + 1,
      ArrowDown: index - 1,
      ArrowLeft: index - 1,
      PageDown: index - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (target === undefined) {
      return;
    }

    event.preventDefault();
    this.snapTo(target);
  }

  /** Focus landing on content the sheet hides (tabbing into it while collapsed) raises the sheet a step. */
  onBodyFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const bodyRect = this.body().nativeElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (targetRect.bottom > bodyRect.bottom && this.currentIndex() < this.snapPoints().length - 1) {
      this.snapTo(this.currentIndex() + 1);
    }
  }

  private settleIndex(height: number, velocity: number): number {
    const heights = this.snapHeights();

    if (Math.abs(velocity) >= FLICK_VELOCITY) {
      // A flick goes to the next snap point in its direction from where it was released.
      const candidates = heights
        .map((h, index) => ({ h, index }))
        .filter(({ h }) => (velocity > 0 ? h > height : h < height));
      if (candidates.length > 0) {
        return candidates.reduce((best, c) => (Math.abs(c.h - height) < Math.abs(best.h - height) ? c : best)).index;
      }
    }

    return heights.reduce(
      (best, h, index) => (Math.abs(h - height) < Math.abs(heights[best] - height) ? index : best),
      0,
    );
  }

  private measure(): void {
    const view = this.document.defaultView;
    const container = this.fixed() ? null : this.host.nativeElement.parentElement;
    this.containerHeight.set(container ? container.clientHeight : (view?.innerHeight ?? 0));
  }
}

function resolveSnapPoint(point: UcBottomSheetSnapPoint, containerHeight: number, rootFontSize: number): number {
  if (typeof point === 'number') {
    return clamp(point, 0, containerHeight || point);
  }

  const value = parseFloat(point);
  const px = point.endsWith('%')
    ? (containerHeight * value) / 100
    : point.endsWith('rem')
      ? value * rootFontSize
      : value;

  return clamp(px, 0, containerHeight || px);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
