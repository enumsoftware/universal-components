import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[ucMenuItem]',
  host: {
    class: 'uc-menu-item',
    role: 'menuitem',
    '[attr.data-uc-menu-item]': "'true'",
    '[attr.aria-disabled]': 'ucMenuItemDisabled()',
    '[attr.tabindex]': 'ucMenuItemDisabled() ? -1 : 0',
  },
})
export class UcMenuItem {
  readonly ucMenuItemDisabled = input(false, {
    alias: 'ucMenuItemDisabled',
    transform: booleanAttribute,
  });
}
