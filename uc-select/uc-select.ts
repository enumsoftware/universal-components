import {
  Component,
  ElementRef,
  input,
  model,
  computed,
  signal,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

/**
 * Option interface for select dropdown
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
}

/** Gap between the trigger and the panel, mirrored by the overlay offsets. */
const PANEL_OFFSET = 8;

/** Keeps the panel clear of the viewport edges when it flips. */
const VIEWPORT_MARGIN = 8;

/** Ceiling for the panel, matching the `max-height` the panel used to hard-code in CSS. */
const PANEL_MAX_HEIGHT = 300;

/** Floor for the panel so a cramped viewport still gets a scrollable list. */
const PANEL_MIN_HEIGHT = 120;

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

  imports: [CommonModule, FormsModule, OverlayModule],
  templateUrl: './uc-select.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './uc-select.css',
  host: {
    class: 'uc-select-host',
  },
})
export class UcSelect<T = string> implements FormValueControl<T | null> {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

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
  readonly showLabel = computed(() => !!this.label() && !this.hideLabel());

  /** Only point at the label element while it is actually rendered. */
  readonly triggerAriaLabelledBy = computed(() => (this.showLabel() ? this.labelId() : null));

  /** Names the trigger from the label text, or the placeholder when there is no label. */
  readonly triggerAriaLabel = computed(() =>
    this.showLabel() ? null : this.label() || this.placeholder(),
  );

  selectedOption = computed(() => {
    const currentValue = this.value();
    return this.options().find((opt) => opt.value === currentValue);
  });

  selectedLabel = computed(() => {
    return this.selectedOption()?.label || this.placeholder();
  });

  /**
   * Toggle the dropdown open/close state
   */
  toggleDropdown(): void {
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
    if (this.disabled()) {
      return;
    }

    this.measurePanel();
    this.isOpen.set(true);
  }

  /**
   * Close the dropdown
   */
  closeDropdown(): void {
    this.isOpen.set(false);
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

  private triggerElement(): HTMLElement | null {
    return this.hostRef.nativeElement.querySelector<HTMLElement>('.uc-select-trigger');
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
