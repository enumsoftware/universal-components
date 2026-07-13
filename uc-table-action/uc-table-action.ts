import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

export const TABLE_ACTION_VARIANT_OPTIONS = ['primary', 'secondary'] as const;
export type TableActionVariant = (typeof TABLE_ACTION_VARIANT_OPTIONS)[number];

@Component({
  selector: 'uc-table-action',
  templateUrl: './uc-table-action.html',
  styleUrl: './uc-table-action.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcTableAction {
  text = input.required<string>();
  icon = input<string>();
  variant = input<TableActionVariant>('primary');
  clicked = output<void>();

  onClick() {
    this.clicked.emit();
  }
}
