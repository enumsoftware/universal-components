import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  WritableSignal,
  computed,
  inject,
  input,
  model,
  signal,
  Signal,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { map } from 'rxjs';
import { UcInput } from '../uc-input/uc-input';
import { UcButton } from '../uc-button/uc-button';
import { UcPagination } from '../uc-pagination/uc-pagination';

/**
 * Option interface for select dropdown
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export type UcSelectDisplayMode = 'auto' | 'dropdown' | 'dialog';
export type UcSelectLoadMode = 'all' | 'page' | 'infinite';

export interface UcSelectQuery {
  search: string;
  page: number;
  pageSize: number;
  cursor: string | null;
}

export interface UcSelectLoadResult<T = string> {
  items: SelectOption<T>[];
  total?: number;
  hasMore?: boolean;
  nextCursor?: string | null;
}

export type UcSelectDataSource<T = string> = (
  query: UcSelectQuery,
) => Promise<UcSelectLoadResult<T>>;

type UcSelectMobileDialogData<T = unknown> = {
  id: string;
  label: string;
  placeholder: string;
  searchable: boolean;
  searchQuery: WritableSignal<string>;
  visibleOptions: Signal<SelectOption<T>[]>;
  loading: Signal<boolean>;
  loadError: Signal<string | null>;
  hasMore: Signal<boolean>;
  currentPage: Signal<number>;
  totalItems: Signal<number | null>;
  pageSize: number;
  loadMode: UcSelectLoadMode;
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onSelectOption: (option: SelectOption<T>) => void;
  onLoadMore: () => void;
  onPageChange: (zeroBasedPage: number) => void;
};

/** uc-input emits its raw value type; the search query the select tracks is always a string. */
function toSearchQuery(value: string | number | null): string {
  return value === null ? '' : String(value);
}

@Component({
  selector: 'uc-select-mobile-dialog-content',
  imports: [CommonModule, UcInput, UcButton, UcPagination],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section class="uc-select-mobile-dialog" aria-modal="true" role="dialog">
      <header class="uc-select-mobile-dialog__header">
        <h3 class="uc-select-mobile-dialog__title">{{ data.label || data.placeholder }}</h3>
        <button type="button" class="uc-select-mobile-dialog__close" (click)="data.onClose()" aria-label="Close">
          ✕
        </button>
      </header>

      @if (data.searchable) {
        <div class="uc-select-search">
          <uc-input
            [id]="data.id + '-search-mobile'"
            [value]="data.searchQuery()"
            [placeholder]="'Search ' + (data.label || data.placeholder).toLowerCase()"
            (valueChange)="onQueryValueChange($event)"
          />
        </div>
      }

      <div class="uc-select-panel" role="listbox" [id]="data.id + '-mobile-panel'" [attr.aria-label]="data.label || data.placeholder">
        @if (data.loading()) {
          <div class="uc-select-status-row">Loading options…</div>
        }

        @if (data.loadError(); as error) {
          <div class="uc-select-status-row uc-select-status-row-error">{{ error }}</div>
        }

        @if (data.visibleOptions().length > 0) {
          @for (option of data.visibleOptions(); track option.label + '-' + $index) {
            <button
              type="button"
              class="uc-select-option"
              [class.uc-select-option-disabled]="option.disabled"
              [disabled]="option.disabled"
              role="option"
              (click)="data.onSelectOption(option)"
            >
              @if (option.icon) {
                <span class="uc-select-option-icon">{{ option.icon }}</span>
              }
              <span class="uc-select-option-label">{{ option.label }}</span>
            </button>
          }
        } @else if (!data.loading() && !data.loadError()) {
          <div class="uc-select-no-options">No options available</div>
        }
      </div>

      @if (data.loadMode === 'infinite') {
        <div class="uc-select-load-controls">
          <uc-button
            text="Load more"
            variant="secondary"
            size="small"
            [disabled]="data.loading() || !data.hasMore()"
            [loading]="data.loading()"
            (clicked)="data.onLoadMore()"
          />
        </div>
      }

      @if (data.loadMode === 'page') {
        <div class="uc-select-pager">
          <uc-pagination
            [currentPage]="data.currentPage() - 1"
            [totalItems]="data.totalItems() ?? 0"
            [pageSize]="data.pageSize"
            [showPageSelector]="false"
            (pageChange)="data.onPageChange($event)"
          />
        </div>
      }
    </section>
  `,
})
class UcSelectMobileDialogContent {
  readonly data = inject<UcSelectMobileDialogData>(DIALOG_DATA);

  onQueryValueChange(value: string | number | null): void {
    this.data.onQueryChange(toSearchQuery(value));
  }
}

/** Gap between the trigger and the panel, mirrored by the overlay offsets. */
const PANEL_OFFSET = 8;

/** Keeps the panel clear of the viewport edges when it flips. */
const VIEWPORT_MARGIN = 8;

/** Ceiling for the panel, matching the `max-height` the panel used to hard-code in CSS. */
const PANEL_MAX_HEIGHT = 300;

/** Floor for the panel so a cramped viewport still gets a scrollable list. */
const PANEL_MIN_HEIGHT = 120;

const MOBILE_BREAKPOINT = '(max-width: 767px)';

/**
 * Raw theme tokens the panel reads. The panel renders in the CDK overlay container at the end of
 * `<body>`, so anything a host scopes onto an ancestor (the `uc-editor` toolbar does exactly
 * this) no longer cascades into it. These are copied off the host onto the panel at open time,
 * where the panel rule resolves them the same way :root does — copying the raw tokens rather than
 * the resolved ones keeps this independent of whether the DOM substitutes var() in computed
 * custom property values.
 */
const PANEL_INHERITED_PROPERTIES = [
  '--uc-select-panel-shadow',
  '--uc-select-option-hover-background',
  '--uc-select-option-selected-background',
  '--uc-select-option-selected-color',
  '--uc-select-option-padding',
  '--uc-select-option-font-size',
  '--uc-input-background-color',
  '--uc-input-border-color',
  '--uc-input-border-radius',
  '--foreground-color',
  '--primary-color',
] as const;

@Component({
  selector: 'uc-select',

  imports: [CommonModule, FormsModule, OverlayModule, UcInput, UcButton, UcPagination],
  templateUrl: './uc-select.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './uc-select.css',
  host: {
    class: 'uc-select-host',
  },
})
export class UcSelect<T = string> implements FormValueControl<T | null>, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly dialog = inject(Dialog);

  private readonly isMobileViewport = toSignal(
    this.breakpointObserver.observe(MOBILE_BREAKPOINT).pipe(map((state) => state.matches)),
    {
      initialValue: false,
    },
  );

  private searchDebounceId: ReturnType<typeof setTimeout> | null = null;
  private requestSequence = 0;
  private mobileDialogRef: DialogRef<unknown, UcSelectMobileDialogContent> | null = null;

  // Input properties
  readonly id = input.required<string>();
  readonly label = input<string>('');
  /** Keeps the label available to assistive tech while removing it from the layout. */
  readonly hideLabel = input<boolean>(false);
  readonly placeholder = input<string>('Select an option');
  readonly options = input<SelectOption<T>[]>([]);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);

  readonly searchable = input<boolean>(false);
  readonly displayMode = input<UcSelectDisplayMode>('auto');
  readonly loadMode = input<UcSelectLoadMode>('all');
  readonly dataSource = input<UcSelectDataSource<T> | null>(null);
  readonly pageSize = input<number>(25);
  readonly searchDebounceMs = input<number>(250);
  readonly serverSearch = input<boolean>(false);

  // Model properties
  value = model<T | null>(null);
  touched = model<boolean>(false);
  invalid = model<boolean>(false);

  // Internal state
  isOpen = signal<boolean>(false);

  /** Panel width, tracked so the dropdown keeps lining up with the trigger it detached from. */
  readonly panelWidth = signal<number>(0);

  /** Theming copied off the host, plus the max height that fits the space we can flip into. */
  readonly panelStyle = signal<Record<string, string>>({});
  readonly searchQuery = signal<string>('');
  readonly loading = signal<boolean>(false);
  readonly loadError = signal<string | null>(null);
  readonly loadedOptions = signal<SelectOption<T>[]>([]);
  readonly hasMore = signal<boolean>(false);
  readonly currentPage = signal<number>(1);
  readonly nextCursor = signal<string | null>(null);
  readonly totalItems = signal<number | null>(null);

  /**
   * Below the trigger first, then above it, then the same two end-aligned. The CDK takes the first
   * position that fits and otherwise falls back to whichever shows the most of the panel, so a
   * trigger near the bottom of the viewport opens upwards instead of clipping its options.
   */
  readonly panelPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: PANEL_OFFSET,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -PANEL_OFFSET,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: PANEL_OFFSET,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -PANEL_OFFSET,
    },
  ];

  readonly viewportMargin = VIEWPORT_MARGIN;

  // Computed properties
  showErrorState = computed(() => this.invalid() && this.touched());

  readonly labelId = computed(() => `${this.id()}-label`);
  readonly panelId = computed(() => `${this.id()}-panel`);
  readonly showLabel = computed(() => !!this.label() && !this.hideLabel());

  /** Only point at the label element while it is actually rendered. */
  readonly triggerAriaLabelledBy = computed(() => (this.showLabel() ? this.labelId() : null));

  /** Names the trigger from the label text, or the placeholder when there is no label. */
  readonly triggerAriaLabel = computed(() =>
    this.showLabel() ? null : this.label() || this.placeholder(),
  );

  readonly isDialogMode = computed(() => {
    const mode = this.displayMode();

    if (mode === 'dialog') {
      return true;
    }

    if (mode === 'dropdown') {
      return false;
    }

    return this.isMobileViewport();
  });

  readonly triggerAriaHasPopup = computed(() => (this.isDialogMode() ? 'dialog' : 'listbox'));

  readonly visibleOptions = computed(() => {
    const staticOptions = this.dataSource() ? this.loadedOptions() : this.options();

    if (!this.searchable() || (this.dataSource() && this.serverSearch())) {
      return staticOptions;
    }

    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return staticOptions;
    }

    return staticOptions.filter((option) => option.label.toLowerCase().includes(query));
  });

  selectedOption = computed(() => {
    const currentValue = this.value();
    const options = this.dataSource() ? this.loadedOptions() : this.options();
    return options.find((opt) => opt.value === currentValue);
  });

  selectedLabel = computed(() => {
    return this.selectedOption()?.label || this.placeholder();
  });

  /**
   * Toggle the dropdown open/close state
   */
  toggleDropdown(): void {
    if (this.isDisabled()) {
      return;
    }

    if (this.isDialogMode()) {
      if (this.mobileDialogRef) {
        this.closeDropdown();
      } else {
        this.openDialog();
      }
      return;
    }

    if (this.isOpen()) {
      this.closeDropdown();
      return;
    }

    this.openDropdown();
  }

  /**
   * Open the dropdown
   */
  openDropdown(): void {
    if (this.isDisabled()) {
      return;
    }

    if (this.isDialogMode()) {
      this.openDialog();
      return;
    }

    this.ensureDataLoaded();
    this.measurePanel();
    this.isOpen.set(true);
  }

  openDialog(): void {
    if (this.mobileDialogRef || this.isDisabled()) {
      return;
    }

    this.ensureDataLoaded();
    const dialogRef = this.dialog.open(UcSelectMobileDialogContent, {
      panelClass: 'uc-select-mobile-dialog-pane',
      autoFocus: false,
      data: this.buildMobileDialogData(),
    });
    this.mobileDialogRef = dialogRef;

    dialogRef.closed.subscribe(() => {
      this.mobileDialogRef = null;
      this.touched.set(true);
      this.triggerElement()?.focus();
    });
  }

  /**
   * Close the dropdown
   */
  closeDropdown(): void {
    this.isOpen.set(false);
    this.closeMobileDialog();
  }

  /**
   * Select an option by value
   */
  selectOption(option: SelectOption<T>): void {
    if (!option.disabled) {
      this.value.set(option.value);
      this.touched.set(true);
      this.closeDropdown();
    }
  }

  /**
   * Handle blur event
   */
  onBlur(): void {
    this.touched.set(true);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.toggleDropdown();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
    }
  }

  onSearchInput(query: string): void {
    this.searchQuery.set(query);

    if (!(this.dataSource() && this.serverSearch())) {
      return;
    }

    this.queueRemoteSearch();
  }

  onSearchValueChange(value: string | number | null): void {
    this.onSearchInput(toSearchQuery(value));
  }

  async onPanelScroll(event: Event): Promise<void> {
    if (!this.dataSource() || this.loadMode() !== 'infinite' || this.loading() || !this.hasMore()) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const threshold = 40;
    const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (remaining <= threshold) {
      await this.loadMore();
    }
  }

  async loadMore(): Promise<void> {
    if (!this.dataSource() || this.loading() || this.loadMode() !== 'infinite') {
      return;
    }

    if (!this.hasMore() && this.loadedOptions().length > 0) {
      return;
    }

    await this.loadOptions({ reset: false, append: true });
  }

  /** Handler for uc-pagination's (pageChange), which is zero-indexed. */
  async onPaginationPageChange(zeroBasedPage: number): Promise<void> {
    if (!this.dataSource() || this.loading()) {
      return;
    }

    const page = zeroBasedPage + 1;
    if (page === this.currentPage()) {
      return;
    }

    this.currentPage.set(page);
    await this.loadOptions({ reset: false, append: false });
  }

  /**
   * Close on Escape while the overlay has focus, so a keyboard user is not stuck behind the
   * backdrop that now covers the page.
   */
  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
      this.triggerElement()?.focus();
    }
  }

  ngOnDestroy(): void {
    this.clearSearchDebounce();
    this.closeMobileDialog();
  }

  private closeMobileDialog(): void {
    this.mobileDialogRef?.close();
    this.mobileDialogRef = null;
  }

  private queueRemoteSearch(): void {
    this.clearSearchDebounce();
    this.searchDebounceId = setTimeout(() => {
      this.currentPage.set(1);
      this.nextCursor.set(null);
      void this.loadOptions({ reset: true, append: false });
    }, this.searchDebounceMs());
  }

  private clearSearchDebounce(): void {
    if (!this.searchDebounceId) {
      return;
    }

    clearTimeout(this.searchDebounceId);
    this.searchDebounceId = null;
  }

  private triggerElement(): HTMLElement | null {
    return this.hostRef.nativeElement.querySelector<HTMLElement>('.uc-select-trigger');
  }

  private buildMobileDialogData(): UcSelectMobileDialogData<T> {
    return {
      id: this.id(),
      label: this.label(),
      placeholder: this.placeholder(),
      searchable: this.searchable(),
      searchQuery: this.searchQuery,
      visibleOptions: this.visibleOptions,
      loading: this.loading,
      loadError: this.loadError,
      hasMore: this.hasMore,
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      pageSize: this.pageSize(),
      loadMode: this.loadMode(),
      onClose: () => this.closeDropdown(),
      onQueryChange: (query) => this.onSearchInput(query),
      onSelectOption: (option) => this.selectOption(option),
      onLoadMore: () => {
        void this.loadMore();
      },
      onPageChange: (zeroBasedPage) => {
        void this.onPaginationPageChange(zeroBasedPage);
      },
    };
  }

  private isDisabled(): boolean {
    return this.disabled() || this.readonly();
  }

  private ensureDataLoaded(): void {
    const source = this.dataSource();
    if (!source) {
      return;
    }

    if (this.loadMode() === 'page') {
      void this.loadOptions({ reset: true, append: false });
      return;
    }

    if (this.loadedOptions().length === 0 && !this.loading()) {
      void this.loadOptions({ reset: true, append: false });
    }
  }

  private async loadOptions(params: { reset: boolean; append: boolean }): Promise<void> {
    const source = this.dataSource();
    if (!source) {
      return;
    }

    if (this.loading()) {
      return;
    }

    if (params.reset) {
      this.loadError.set(null);
      this.nextCursor.set(null);
      this.totalItems.set(null);
      this.hasMore.set(false);

      if (this.loadMode() !== 'page') {
        this.currentPage.set(1);
      }

      if (!params.append) {
        this.loadedOptions.set([]);
      }
    }

    this.loading.set(true);
    const requestId = ++this.requestSequence;

    try {
      const result = await source({
        search: this.searchQuery().trim(),
        page: this.currentPage(),
        pageSize: this.pageSize(),
        cursor: this.nextCursor(),
      });

      if (requestId !== this.requestSequence) {
        return;
      }

      const items = result.items ?? [];

      if (typeof result.total === 'number') {
        this.totalItems.set(result.total);
      }

      this.nextCursor.set(result.nextCursor ?? null);

      if (this.loadMode() === 'infinite' && params.append) {
        this.loadedOptions.update((existing) => [...existing, ...items]);
      } else {
        this.loadedOptions.set(items);
      }

      const total = this.totalItems();
      const hasMore =
        typeof result.hasMore === 'boolean'
          ? result.hasMore
          : this.deriveHasMore({
              loadedCount: this.loadedOptions().length,
              currentBatchCount: items.length,
              total,
              nextCursor: result.nextCursor ?? null,
            });

      this.hasMore.set(hasMore);
      this.loadError.set(null);
    } catch {
      if (requestId !== this.requestSequence) {
        return;
      }

      this.loadError.set('Failed to load options. Please try again.');
    } finally {
      if (requestId === this.requestSequence) {
        this.loading.set(false);
      }
    }
  }

  private deriveHasMore(params: {
    loadedCount: number;
    currentBatchCount: number;
    total: number | null;
    nextCursor: string | null;
  }): boolean {
    if (params.nextCursor) {
      return true;
    }

    if (this.loadMode() === 'all') {
      return false;
    }

    if (typeof params.total === 'number') {
      if (this.loadMode() === 'page') {
        return this.currentPage() * this.pageSize() < params.total;
      }

      return params.loadedCount < params.total;
    }

    return params.currentBatchCount >= this.pageSize();
  }

  /**
   * Size the panel to the trigger and to the room actually available above or below it, and carry
   * the host's resolved theming across into the overlay container.
   */
  private measurePanel(): void {
    const trigger = this.triggerElement();

    if (!trigger || typeof getComputedStyle !== 'function') {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    this.panelWidth.set(rect.width);

    const hostStyle = getComputedStyle(this.hostRef.nativeElement);
    const style: Record<string, string> = {};

    for (const property of PANEL_INHERITED_PROPERTIES) {
      const resolved = hostStyle.getPropertyValue(property).trim();

      if (resolved) {
        style[property] = resolved;
      }
    }

    const gap = PANEL_OFFSET + VIEWPORT_MARGIN;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const available = Math.max(spaceBelow, spaceAbove);
    const maxHeight = Math.max(PANEL_MIN_HEIGHT, Math.min(PANEL_MAX_HEIGHT, available));

    style['max-height'] = `${Math.round(maxHeight)}px`;

    this.panelStyle.set(style);
  }
}
