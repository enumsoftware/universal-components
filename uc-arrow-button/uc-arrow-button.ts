import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-arrow-button',
  templateUrl: './uc-arrow-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-arrow-button.css',
})
export class UcArrowButton {
  text = model.required();
  variant = input<'primary' | 'secondary'>('primary');
  phosphorIcon = input<string>('arrow-right');
  iconPosition = input<'start' | 'end'>('end');
  padded = input(false);

  clicked = output<void>();

  onClicked(): void {
    this.clicked.emit();
  }
}
