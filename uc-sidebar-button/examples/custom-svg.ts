import { Component } from '@angular/core';

import { UcSidebarButton } from '../uc-sidebar-button';

/** Any projected element works as the icon, not only uc-phosphor-icon. */
@Component({
  selector: 'uc-sidebar-button-custom-svg-example',
  imports: [UcSidebarButton],
  template: `
    <uc-sidebar-button text="Custom" [active]="false" style="primary">
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 12h16" />
        <path d="M12 4v16" />
      </svg>
    </uc-sidebar-button>
  `,
})
export class SidebarButtonCustomSvgExample {}
