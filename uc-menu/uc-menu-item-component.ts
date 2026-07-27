import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

@Component({
  selector: 'uc-menu-item',
  templateUrl: './uc-menu-item-component.html',
  styleUrl: './uc-menu-item-component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'uc-menu-item-component',
    role: 'menuitem',
    '[attr.data-uc-menu-item]': "'true'",
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'onClick($event)',
  },
})
export class UcMenuItemComponent {
  readonly text = input<string>('');
  readonly icon = input<string>('');
  readonly disabled = input(false, {
    transform: booleanAttribute,
  });

  readonly selected = output<void>();

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.selected.emit();
  }
}
