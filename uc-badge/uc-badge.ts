import { AriaDescriber } from '@angular/cdk/a11y';
import {
  afterNextRender,
  ApplicationRef,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  createComponent,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  Renderer2,
} from '@angular/core';

export const BADGE_POSITION_OPTIONS = ['top-end', 'top-start', 'bottom-end', 'bottom-start'] as const;
export type UcBadgePosition = (typeof BADGE_POSITION_OPTIONS)[number];

/** `small` is a dot without text, for "something new" rather than a count. */
export const BADGE_SIZE_OPTIONS = ['small', 'medium', 'large'] as const;
export type UcBadgeSize = (typeof BADGE_SIZE_OPTIONS)[number];

export const BADGE_VARIANT_OPTIONS = ['error', 'primary', 'success', 'neutral'] as const;
export type UcBadgeVariant = (typeof BADGE_VARIANT_OPTIONS)[number];

/**
 * The badge element the directive appends to its host. It reads everything from the directive it is
 * given, and is not exported.
 */
@Component({
  selector: 'uc-badge',
  template: `{{ badge().ucBadgeSize() === 'small' ? '' : badge().text() }}`,
  styleUrl: './uc-badge.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    // The count is visual only. Screen readers get `ucBadgeDescription` through aria-describedby.
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
})
class UcBadgeContent {
  /** Set by the directive right after it creates the badge. */
  readonly badge = input.required<UcBadge>();

  protected readonly classes = computed(() => {
    const badge = this.badge();
    return [
      'uc-badge',
      `uc-badge--${badge.ucBadgePosition()}`,
      `uc-badge--${badge.ucBadgeSize()}`,
      `uc-badge--${badge.ucBadgeVariant()}`,
      badge.ucBadgeOverlap() ? 'uc-badge--overlap' : 'uc-badge--detached',
      badge.visible() ? '' : 'uc-badge--hidden',
      badge.ucBadgeDisabled() ? 'uc-badge--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}

/**
 * Puts a small count or status dot on the corner of any element, like Angular Material's `matBadge`:
 *
 * ```html
 * <uc-button text="Inbox" ucBadge="4" ucBadgeDescription="4 unread messages" />
 * ```
 *
 * The badge is appended inside the host and positioned against it, so the host needs to be able to
 * hold children (not an `<img>` or `<input>`) and must not clip overflow.
 */
@Directive({
  selector: '[ucBadge]',
})
export class UcBadge {
  /** The text or count. An empty value hides the badge, except at `small` size, which never shows text. */
  readonly ucBadge = input<string | number | null | undefined>(null);
  readonly ucBadgePosition = input<UcBadgePosition>('top-end');
  readonly ucBadgeSize = input<UcBadgeSize>('medium');
  readonly ucBadgeVariant = input<UcBadgeVariant>('error');
  /** Overlap the host's corner. When false the badge sits beside the host instead. */
  readonly ucBadgeOverlap = input(true, { transform: booleanAttribute });
  readonly ucBadgeHidden = input(false, { transform: booleanAttribute });
  readonly ucBadgeDisabled = input(false, { transform: booleanAttribute });
  /** Numbers above this are shown as `max+`, such as `99+`. */
  readonly ucBadgeMax = input<number | null>(null);
  /** What the badge means, for screen readers, such as "4 unread messages". */
  readonly ucBadgeDescription = input<string | null>(null);

  readonly text = computed(() => {
    const content = this.ucBadge();
    const max = this.ucBadgeMax();
    if (content === null || content === undefined) {
      return '';
    }

    const count = Number(content);
    if (max !== null && content !== '' && Number.isFinite(count) && count > max) {
      return `${max}+`;
    }

    return String(content);
  });

  readonly visible = computed(() => !this.ucBadgeHidden() && (this.ucBadgeSize() === 'small' || this.text() !== ''));

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const renderer = inject(Renderer2);
    const appRef = inject(ApplicationRef);
    const ariaDescriber = inject(AriaDescriber);

    const badge = createComponent(UcBadgeContent, {
      environmentInjector: inject(EnvironmentInjector),
    });
    badge.setInput('badge', this);
    appRef.attachView(badge.hostView);
    renderer.appendChild(host, badge.location.nativeElement);

    inject(DestroyRef).onDestroy(() => {
      appRef.detachView(badge.hostView);
      badge.destroy();
    });

    // The badge is positioned against the host. Only a static host is changed, so a host that is
    // already absolute, fixed or sticky keeps its own positioning.
    afterNextRender(() => {
      if (getComputedStyle(host).position === 'static') {
        renderer.setStyle(host, 'position', 'relative');
      }
    });

    effect((onCleanup) => {
      const description = this.ucBadgeDescription();
      if (description && this.visible()) {
        ariaDescriber.describe(host, description);
        onCleanup(() => ariaDescriber.removeDescription(host, description));
      }
    });
  }
}
