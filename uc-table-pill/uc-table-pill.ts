import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export const TABLE_PILL_VARIANT_OPTIONS = ['info', 'valid', 'error'] as const;
export type TablePillVariant = (typeof TABLE_PILL_VARIANT_OPTIONS)[number];

@Component({
  selector: 'uc-table-pill',
  templateUrl: './uc-table-pill.html',
  styleUrl: './uc-table-pill.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcTablePill {
  variant = input<TablePillVariant>('info');
}
