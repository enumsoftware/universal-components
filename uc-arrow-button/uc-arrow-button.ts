import { NgClass } from '@angular/common';
import { Component, input, model, output, signal } from '@angular/core';

@Component({
  selector: 'uc-arrow-button',
  imports: [NgClass],
  templateUrl: './uc-arrow-button.html',
  styleUrl: './uc-arrow-button.scss',
})
export class UcArrowButton {
  text = model.required();
  variant = input<'primary' | 'secondary'>('primary');
  phosphorIcon = input<string>('arrow-right');
  iconPosition = input<'start' | 'end'>('end');

  clicked = output<void>();

  onClicked(): void {
    this.clicked.emit();
  }
}
