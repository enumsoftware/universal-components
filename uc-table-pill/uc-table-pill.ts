import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'uc-table-pill',
  templateUrl: './uc-table-pill.html',
  styleUrl: './uc-table-pill.scss',
  imports: [NgClass],
})
export class UcTablePill {
  variant = input<'info' | 'valid' | 'error'>('info');
}
