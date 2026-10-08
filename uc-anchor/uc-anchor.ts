import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { UC_DEFAULTS } from '../uc-defaults/uc-defaults';

export const ANCHOR_VARIANT_OPTIONS = ['primary', 'error'] as const;
export type UcAnchorVariant = (typeof ANCHOR_VARIANT_OPTIONS)[number];

/**
 * Styles a real `<a>` as a button-like link, matching `uc-button`'s `primary` and `error`
 * variants at its medium size:
 *
 * ```html
 * <a ucAnchor href="/billing" variant="primary">Go to billing</a>
 * <a ucAnchor href="/account" variant="error">Delete account</a>
 * ```
 *
 * It applies classes and a few `aria-*`/`tabindex` attributes directly to the host element rather
 * than wrapping it, so the anchor stays a real anchor: middle click, ctrl/cmd-click, "open in new
 * tab" and "copy link address" all keep working exactly as they would on any other link, with no
 * code needed to support them.
 *
 * `href`, `target`, `rel`, `download` and any router directive (such as `routerLink`) stay on the
 * element exactly as written - this only adds presentation.
 */
@Component({
  selector: 'a[ucAnchor]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-anchor.css',
  host: {
    '[class]': 'classes()',
    '[attr.href]': 'href()',
    '[attr.role]': "disabled() ? 'link' : null",
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.tabindex]': "disabled() ? '0' : null",
  },
})
export class UcAnchor {
  variant = input<UcAnchorVariant>(inject(UC_DEFAULTS).anchor?.variant ?? 'primary');
  disabled = input(false, { transform: booleanAttribute });

  /**
   * Captured once, before `disabled` can remove it: whatever `href` the consumer wrote in the
   * template (or none), restored whenever the anchor is not disabled.
   */
  private readonly originalHref = inject<ElementRef<HTMLAnchorElement>>(ElementRef).nativeElement.getAttribute(
    'href',
  );

  /**
   * A disabled anchor loses its `href` entirely rather than just looking disabled. Without it, a
   * link has no default action to prevent: no navigation on click, middle click, "open in new
   * tab" or keyboard activation, exactly as a disabled control should behave.
   */
  protected readonly href = computed(() => (this.disabled() ? null : this.originalHref));

  /**
   * Color transitions stay off until the frame after the variant class has been rendered, so the
   * anchor never animates from its unstyled colors to its variant colors.
   */
  private readonly transitionsEnabled = signal(false);

  protected readonly classes = computed(() =>
    [
      'uc-anchor',
      `uc-${this.variant()}`,
      this.disabled() ? 'uc-disabled' : '',
      this.transitionsEnabled() ? 'uc-transitions' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  constructor() {
    afterNextRender(() => {
      requestAnimationFrame(() => this.transitionsEnabled.set(true));
    });
  }
}
