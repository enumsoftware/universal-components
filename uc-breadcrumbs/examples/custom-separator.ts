import { Component } from '@angular/core';

import { UcBreadcrumb, UcBreadcrumbs, UcBreadcrumbSeparator } from '../uc-breadcrumbs';

/** A text `separator`, and a `ucBreadcrumbSeparator` template for anything richer, such as an icon. */
@Component({
  selector: 'uc-breadcrumbs-custom-separator-example',
  imports: [UcBreadcrumbs, UcBreadcrumb, UcBreadcrumbSeparator],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
  template: `
    <uc-breadcrumbs separator="›" label="Breadcrumb, text separator">
      <a *ucBreadcrumb href="#">Home</a>
      <a *ucBreadcrumb href="#">Catalog</a>
      <span *ucBreadcrumb aria-current="page">Accessories</span>
    </uc-breadcrumbs>

    <uc-breadcrumbs label="Breadcrumb, icon separator">
      <a *ucBreadcrumb href="#">Home</a>
      <a *ucBreadcrumb href="#">Catalog</a>
      <span *ucBreadcrumb aria-current="page">Accessories</span>
      <ng-template ucBreadcrumbSeparator><i class="ph ph-caret-right"></i></ng-template>
    </uc-breadcrumbs>
  `,
})
export class CustomSeparatorExample {}
