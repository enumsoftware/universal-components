import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  numberAttribute,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { UC_DEFAULTS } from '../uc-defaults/uc-defaults';

export const BREADCRUMBS_VARIANT_OPTIONS = ['plain', 'pills'] as const;
export type UcBreadcrumbsVariant = (typeof BREADCRUMBS_VARIANT_OPTIONS)[number];

/**
 * One crumb. Written as a structural directive so the consumer's own element - a plain `<a href>`,
 * an `<a routerLink>` or a `<span>` for the current page - is rendered unchanged inside the list:
 *
 * ```html
 * <a *ucBreadcrumb href="/">Home</a>
 * <span *ucBreadcrumb aria-current="page">Shoes</span>
 * ```
 */
@Directive({ selector: '[ucBreadcrumb]' })
export class UcBreadcrumb {
  readonly templateRef = inject(TemplateRef);
}

/** Replaces the text separator with custom markup, such as an icon: `<ng-template ucBreadcrumbSeparator>`. */
@Directive({ selector: '[ucBreadcrumbSeparator]' })
export class UcBreadcrumbSeparator {
  readonly templateRef = inject(TemplateRef);
}

type BreadcrumbEntry = { kind: 'item'; item: UcBreadcrumb } | { kind: 'collapse' };

/**
 * A navigation trail. Renders `<nav><ol>` with an `aria-hidden` separator between crumbs and, past
 * `maxItems`, collapses the middle crumbs behind an ellipsis button that expands the full path.
 */
@Component({
  selector: 'uc-breadcrumbs',
  imports: [NgTemplateOutlet],
  templateUrl: './uc-breadcrumbs.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-breadcrumbs.css',
})
export class UcBreadcrumbs {
  /** `plain` is text links with separators; `pills` gives every crumb a rounded background. */
  readonly variant = input<UcBreadcrumbsVariant>(inject(UC_DEFAULTS).breadcrumbs?.variant ?? 'plain');
  /** Text drawn between crumbs. Ignored when a `ucBreadcrumbSeparator` template is projected. */
  readonly separator = input('/');
  /** Accessible name of the `<nav>` landmark. */
  readonly label = input('Breadcrumb');
  /** Past this many crumbs the middle ones collapse. */
  readonly maxItems = input(8, { transform: numberAttribute });
  readonly itemsBeforeCollapse = input(1, { transform: numberAttribute });
  readonly itemsAfterCollapse = input(1, { transform: numberAttribute });
  /** Accessible name of the ellipsis button. */
  readonly expandText = input('Show path');

  protected readonly items = contentChildren(UcBreadcrumb);
  protected readonly separatorTemplate = contentChild(UcBreadcrumbSeparator);
  private readonly list = viewChild.required<ElementRef<HTMLOListElement>>('list');
  private readonly injector = inject(Injector);

  protected readonly expanded = signal(false);

  protected readonly entries = computed<BreadcrumbEntry[]>(() => {
    const all: BreadcrumbEntry[] = this.items().map((item) => ({
      kind: 'item',
      item,
    }));
    const before = this.itemsBeforeCollapse();
    const after = this.itemsAfterCollapse();

    // A collapse that would hide nothing only swaps crumbs for a button.
    if (this.expanded() || all.length <= this.maxItems() || before + after >= all.length) {
      return all;
    }

    return [...all.slice(0, before), { kind: 'collapse' }, ...all.slice(all.length - after)];
  });

  protected expand(): void {
    const firstHidden = this.itemsBeforeCollapse();
    this.expanded.set(true);

    // The button that had focus is gone; move focus to the first crumb it revealed.
    afterNextRender(
      () => {
        const item = this.list().nativeElement.querySelectorAll<HTMLElement>('.uc-breadcrumbs__item')[firstHidden];
        item?.querySelector<HTMLElement>('a[href], button, [tabindex]')?.focus();
      },
      { injector: this.injector },
    );
  }
}
