import { Component, input } from '@angular/core';

import { UcPhosphorIcon } from '../../uc-phosphor-icon/uc-phosphor-icon';
import { UcSidebarButton, type SidebarButtonStyle } from '../uc-sidebar-button';

/** The icon is projected content, so the showcase drives it through a preview. */
@Component({
  selector: 'uc-sidebar-button-preview',
  imports: [UcSidebarButton, UcPhosphorIcon],
  template: `
    <uc-sidebar-button [text]="text()" [active]="active()" [style]="style()">
      @if (icon()) {
        <uc-phosphor-icon [icon]="icon()" />
      }
    </uc-sidebar-button>
  `,
})
export class SidebarButtonPreview {
  readonly text = input<string>('Dashboard');
  readonly active = input<boolean>(false);
  readonly style = input<SidebarButtonStyle>('primary');
  readonly icon = input<string>('house');
}
