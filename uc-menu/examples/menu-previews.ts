import { Component } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcMenuItemComponent } from '../uc-menu-item-component';
import { UcMenuItem } from '../uc-menu-item';
import { UcMenuTriggerFor } from '../uc-menu-trigger-for';
import { UcMenu } from '../uc-menu';

@Component({
  selector: 'uc-menu-basic-example',
  imports: [UcButton, UcMenu, UcMenuItemComponent, UcMenuTriggerFor],
  template: `
    <uc-button text="Actions" [ucMenuTriggerFor]="menu" />

    <uc-menu #menu="ucMenu">
      <uc-menu-item text="View profile" icon="ph ph-user" />
      <uc-menu-item text="Settings" icon="ph ph-gear" />
      <uc-menu-item text="Remove" icon="ph ph-trash" [disabled]="true" />
    </uc-menu>
  `,
})
export class MenuBasicExample {}

/** Any element can be the trigger, not just a uc-button. */
@Component({
  selector: 'uc-menu-native-trigger-example',
  imports: [UcMenu, UcMenuItem, UcMenuTriggerFor],
  styles: `
    .trigger {
      padding: 0.6rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--uc-content-hr-color);
      background: var(--background-color);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
  `,
  template: `
    <button type="button" class="trigger" [ucMenuTriggerFor]="menu">Open menu</button>

    <uc-menu #menu="ucMenu">
      <button type="button" ucMenuItem>Duplicate</button>
      <button type="button" ucMenuItem>Archive</button>
      <button type="button" ucMenuItem>Export</button>
    </uc-menu>
  `,
})
export class MenuNativeTriggerExample {}

/** `ucMenuItem` styles any button, so items can carry arbitrary content. */
@Component({
  selector: 'uc-menu-directive-items-example',
  imports: [UcButton, UcMenu, UcMenuItem, UcMenuTriggerFor],
  template: `
    <uc-button text="More options" [ucMenuTriggerFor]="menu" />

    <uc-menu #menu="ucMenu">
      <button type="button" ucMenuItem>
        <i class="ph ph-copy"></i>
        Duplicate
      </button>
      <button type="button" ucMenuItem>
        <i class="ph ph-download-simple"></i>
        Download
      </button>
    </uc-menu>
  `,
})
export class MenuDirectiveItemsExample {}
