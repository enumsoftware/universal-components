import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'uc-button',
  templateUrl: './uc-button.html',
  styleUrl: './uc-button.scss',
})
export class UcButton {
  text = model.required();
  variant = input<'primary' | 'secondary' | 'error'>('primary');
  showArrow = input<boolean>(false);
  align = input<'left' | 'center'>('center');
  disabled = input<boolean>(false);
  clicked = output<void>();
  type = input<'button' | 'submit' | 'reset'>('button');

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.clicked.emit();
  }
}
