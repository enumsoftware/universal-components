import { Component, input } from '@angular/core';

import { UcBreadcrumb, UcBreadcrumbs, type UcBreadcrumbsVariant } from '../uc-breadcrumbs';

/**
 * Crumbs are projected elements, so a bare `uc-breadcrumbs` renders an empty list. This supplies
 * a trail from the `crumbs` knob - every crumb a link except the last, the current page.
 */
@Component({
  selector: 'uc-breadcrumbs-preview',
  imports: [UcBreadcrumbs, UcBreadcrumb],
  template: `
    <uc-breadcrumbs
      [variant]="variant()"
      [separator]="separator()"
      [label]="label()"
      [maxItems]="maxItems()"
      [itemsBeforeCollapse]="itemsBeforeCollapse()"
      [itemsAfterCollapse]="itemsAfterCollapse()"
      [expandText]="expandText()"
    >
      @for (crumb of crumbs(); track $index; let last = $last) {
        @if (last) {
          <span *ucBreadcrumb aria-current="page">{{ crumb }}</span>
        } @else {
          <a *ucBreadcrumb href="#">{{ crumb }}</a>
        }
      }
    </uc-breadcrumbs>
  `,
})
export class BreadcrumbsPreview {
  readonly crumbs = input<string[]>(['Home', 'Catalog', 'Accessories']);
  readonly variant = input<UcBreadcrumbsVariant>('plain');
  readonly separator = input('/');
  readonly label = input('Breadcrumb');
  readonly maxItems = input(8);
  readonly itemsBeforeCollapse = input(1);
  readonly itemsAfterCollapse = input(1);
  readonly expandText = input('Show path');
}
