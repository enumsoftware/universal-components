import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-table-pill',
  templateUrl: './uc-table-pill.html',
  styleUrl: './uc-table-pill.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcTablePill {
  variant = input<'info' | 'valid' | 'error'>('info');
}
