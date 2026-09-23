import {
  Component,
  Directive,
  ElementRef,
  OnDestroy,
  TemplateRef,
  afterRenderEffect,
  computed,
  contentChildren,
  inject,
  input,
  model,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { SelectOption, UcSelect } from '../uc-select/uc-select';

export const TABS_VARIANT_OPTIONS = ['underline', 'pills'] as const;
export type UcTabsVariant = (typeof TABS_VARIANT_OPTIONS)[number];

/** Matches `uc-select`, so the tabs collapse on the same screens where the select opens as a dialog. */
const MOBILE_BREAKPOINT = '(max-width: 767px)';

/** How much of the visible strip one arrow click scrolls, leaving a tab of context on screen. */
const ARROW_SCROLL_RATIO = 0.8;

export interface UcTab {
  key: string;
  label: string;
  /** A disabled tab stays visible but can't be selected. It doesn't change an `activeTab` the host has already set. */
  disabled?: boolean;
  /**
   * Defaults to `true`. `false` hides the tab and its panel completely, unlike `disabled`, which
   * leaves the tab showing. A hidden tab can't be selected. If it is already active, no panel is shown.
   */
  visible?: boolean;
}

@Directive({
  selector: '[ucTabPanel]',
})
export class UcTabPanel {
  readonly key = input.required<string>({ alias: 'ucTabPanel' });
  readonly templateRef = inject(TemplateRef);
}

@Component({
  selector: 'uc-tabs',
  imports: [NgTemplateOutlet, UcSelect],
  templateUrl: './uc-tabs.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-tabs.css',
})
export class UcTabs implements OnDestroy {
  private static nextId = 0;

  readonly tabs = input.required<UcTab[]>();
  readonly activeTab = model.required<string>();
  /** `underline` marks the active tab with a bar beneath it; `pills` fills it with a rounded background. */
  readonly variant = input<UcTabsVariant>('underline');
  /** Accessible name for the dropdown the tabs collapse into on mobile. */
  readonly label = input<string>('Tabs');
  readonly panels = contentChildren(UcTabPanel);

  readonly selectId = `uc-tabs-select-${UcTabs.nextId++}`;

  private readonly strip = viewChild.required<ElementRef<HTMLElement>>('strip');
  private readonly breakpointObserver = inject(BreakpointObserver);
  private resizeObserver: ResizeObserver | null = null;

  readonly isMobileViewport = toSignal(
    this.breakpointObserver.observe(MOBILE_BREAKPOINT).pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  readonly isOverflowing = signal(false);
  readonly canScrollStart = signal(false);
  readonly canScrollEnd = signal(false);

  /** On mobile, tabs that don't fit collapse into a dropdown instead of scrolling. */
  readonly showDropdown = computed(() => this.isMobileViewport() && this.isOverflowing());
  readonly showArrows = computed(() => !this.isMobileViewport() && this.isOverflowing());

  readonly visibleTabs = computed(() => this.tabs().filter((tab) => tab.visible !== false));

  readonly selectOptions = computed<SelectOption[]>(() =>
    this.visibleTabs().map((tab) => ({ value: tab.key, label: tab.label, disabled: tab.disabled })),
  );

  readonly isActiveTabHidden = computed(() =>
    this.tabs().some((tab) => tab.key === this.activeTab() && tab.visible === false),
  );

  constructor() {
    // The strip stays rendered (just invisible) while the dropdown shows, so it can always be
    // measured. Hiding it instead would make it fit again, flipping back and forth between modes.
    afterRenderEffect(() => {
      this.visibleTabs();
      this.variant();
      this.showArrows();
      this.updateOverflowState();
    });

    afterRenderEffect(() => {
      const key = this.activeTab();
      if (this.showArrows()) {
        this.scrollTabIntoView(key);
      }
    });

    afterRenderEffect(() => {
      if (this.resizeObserver || typeof ResizeObserver === 'undefined') {
        return;
      }
      const strip = this.strip().nativeElement;
      this.resizeObserver = new ResizeObserver(() => this.updateOverflowState());
      this.resizeObserver.observe(strip.parentElement ?? strip);
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  selectTab(key: string) {
    const tab = this.tabs().find((candidate) => candidate.key === key);
    if (tab?.disabled || tab?.visible === false) {
      return;
    }
    this.activeTab.set(key);
  }

  onSelectValueChange(key: string | null) {
    if (key !== null) {
      this.selectTab(key);
    }
  }

  scrollByPage(direction: -1 | 1) {
    const strip = this.strip().nativeElement;
    strip.scrollBy({ left: direction * strip.clientWidth * ARROW_SCROLL_RATIO, behavior: 'smooth' });
  }

  updateOverflowState() {
    const strip = this.strip().nativeElement;
    const container = strip.parentElement ?? strip;
    // Compared with the whole bar rather than the strip: the arrows narrow the strip, so measuring
    // the strip would keep them showing after the bar has grown wide enough for every tab. A pixel
    // of slack absorbs sub-pixel rounding, which would otherwise show arrows for tabs that fit.
    this.isOverflowing.set(strip.scrollWidth > container.clientWidth + 1);
    this.canScrollStart.set(strip.scrollLeft > 1);
    this.canScrollEnd.set(strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1);
  }

  private scrollTabIntoView(key: string) {
    const strip = this.strip().nativeElement;
    const tab = Array.from(strip.querySelectorAll<HTMLElement>('.uc-tabs__tab')).find(
      (element) => element.dataset['tabKey'] === key,
    );
    if (!tab) {
      return;
    }

    // Scrolls only the strip. `scrollIntoView` would also scroll the page to bring the tabs up.
    const start = tab.offsetLeft;
    const end = start + tab.offsetWidth;
    if (start < strip.scrollLeft) {
      strip.scrollTo({ left: start, behavior: 'smooth' });
    } else if (end > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: end - strip.clientWidth, behavior: 'smooth' });
    }
  }
}
