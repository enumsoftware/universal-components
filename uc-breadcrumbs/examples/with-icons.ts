import { Component } from '@angular/core';

import { UcBreadcrumb, UcBreadcrumbs } from '../uc-breadcrumbs';

/**
 * A crumb is whatever element the template writes, so an icon is just another child. The icons
 * are `aria-hidden`: the text already names the crumb.
 */
@Component({
  selector: 'uc-breadcrumbs-with-icons-example',
  imports: [UcBreadcrumbs, UcBreadcrumb],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
  template: `
    <uc-breadcrumbs label="Breadcrumb with icons, plain">
      <a *ucBreadcrumb href="#"><i class="ph ph-house" aria-hidden="true"></i>Home</a>
      <a *ucBreadcrumb href="#"><i class="ph ph-storefront" aria-hidden="true"></i>Catalog</a>
      <span *ucBreadcrumb aria-current="page"><i class="ph ph-sneaker" aria-hidden="true"></i>Shoes</span>
    </uc-breadcrumbs>

    <uc-breadcrumbs variant="pills" label="Breadcrumb with icons, pills">
      <a *ucBreadcrumb href="#"><i class="ph ph-house" aria-hidden="true"></i>Home</a>
      <a *ucBreadcrumb href="#"><i class="ph ph-storefront" aria-hidden="true"></i>Catalog</a>
      <span *ucBreadcrumb aria-current="page"><i class="ph ph-sneaker" aria-hidden="true"></i>Shoes</span>
    </uc-breadcrumbs>
  `,
})
export class WithIconsExample {}
