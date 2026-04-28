import { Component, input, output } from '@angular/core';

@Component({
  selector: 'uc-icon-button',
  templateUrl: './uc-icon-button.html',
  styleUrl: './uc-icon-button.css',
})
export class UcIconButton {
  inverseColor = input<boolean>(false);
  clicked = output<void>();
  disabled = input<boolean>(false);
  phosphorIcon = input<string>('');
  phosphorWeight = input<string>('bold');
  variant = input<'primary' | 'error'>('primary');

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.clicked.emit();
  }
}
