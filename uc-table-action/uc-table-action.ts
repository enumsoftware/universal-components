import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-table-action',
  templateUrl: './uc-table-action.html',
  styleUrl: './uc-table-action.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcTableAction {
  text = input.required<string>();
  icon = input<string>();
  variant = input<'primary' | 'secondary'>('primary');
  clicked = output<void>();

  onClick() {
    this.clicked.emit();
  }
}
