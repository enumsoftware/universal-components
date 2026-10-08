import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UcPhosphorIcon, type PhosphorIconWeight } from '../uc-phosphor-icon/uc-phosphor-icon';
import { UC_BOTTOM_NAVIGATION } from './uc-bottom-navigation';

/**
 * One destination of a `uc-bottom-navigation`: put it on the app's own `<a>` (with `routerLink` or `href`) or
 * `<button>`, so navigation stays the app's. It draws the icon over the label and marks the current page.
 */
@Component({
  selector: 'a[ucBottomNavigationItem], button[ucBottomNavigationItem]',
  imports: [UcPhosphorIcon],
  templateUrl: './uc-bottom-navigation-item.html',
  styleUrl: './uc-bottom-navigation-item.css',
  host: {
    class: 'uc-bottom-navigation-item',
    '[class.uc-bottom-navigation-item--active]': 'active()',
    '[class.uc-bottom-navigation-item--icon-only]': '!showLabel()',
    '[attr.aria-current]': "active() ? 'page' : null",
    '[attr.aria-label]': 'ariaLabel()',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcBottomNavigationItem {
  private readonly navigation = inject(UC_BOTTOM_NAVIGATION, { optional: true });

  /** Phosphor icon name, without the `ph-` prefix. */
  readonly icon = input<string | null>(null);
  /** Weight of `icon`; the current item switches to `activeIconWeight`. */
  readonly iconWeight = input<PhosphorIconWeight>('regular');
  readonly activeIconWeight = input<PhosphorIconWeight>('fill');
  /** The current destination: highlighted and announced with `aria-current="page"`. */
  readonly active = input<boolean>(false);
  /** A small count or mark on the icon, e.g. unread messages; `null` shows none. */
  readonly badge = input<string | number | null>(null);
  /** Accessible name, needed when the bar hides the labels. */
  readonly ariaLabel = input<string | null>(null);

  readonly showLabel = computed(() => this.navigation?.showLabels() ?? true);
  readonly weight = computed(() => (this.active() ? this.activeIconWeight() : this.iconWeight()));
}
