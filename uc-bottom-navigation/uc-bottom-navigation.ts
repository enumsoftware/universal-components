import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, InjectionToken, Signal, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

export interface UcBottomNavigationController {
  showLabels: Signal<boolean>;
}

export const UC_BOTTOM_NAVIGATION = new InjectionToken<UcBottomNavigationController>('UC_BOTTOM_NAVIGATION');

/**
 * A bar of top-level destinations along the bottom of the screen, as phone apps have. The items are the app's
 * own links or buttons marked `ucBottomNavigationItem`, so routing stays with the app (`routerLink`, `href`,
 * a click handler) and the library only lays them out and marks the current one.
 */
@Component({
  selector: 'uc-bottom-navigation',
  templateUrl: './uc-bottom-navigation.html',
  styleUrl: './uc-bottom-navigation.css',
  providers: [{ provide: UC_BOTTOM_NAVIGATION, useExisting: UcBottomNavigation }],
  host: {
    '[class.uc-bottom-navigation--fixed]': 'fixed()',
    '[class.uc-bottom-navigation--hidden]': 'hidden()',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcBottomNavigation implements UcBottomNavigationController {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /** Accessible name of the navigation landmark, e.g. "Main navigation". */
  readonly label = input<string | null>(null);
  /**
   * Hides the bar from this viewport width (in px) up, for apps that show their navigation elsewhere on wide
   * screens. `null` (the default) or 0 always shows it.
   */
  readonly hideFrom = input<number | null>(null);
  /** Pins the bar to the bottom of the viewport; leave room for it under the page content. */
  readonly fixed = input<boolean>(false);
  /** Shows each item's text under its icon; without it, items need an `ariaLabel`. */
  readonly showLabels = input<boolean>(true);

  private readonly wide = toSignal(
    toObservable(this.hideFrom).pipe(
      switchMap((width) =>
        width === null || width <= 0
          ? of(false)
          : this.breakpointObserver.observe(`(min-width: ${width}px)`).pipe(map((state) => state.matches)),
      ),
    ),
    { initialValue: false },
  );

  readonly hidden = computed(() => this.wide());
}
