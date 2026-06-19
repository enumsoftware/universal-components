import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-info',
  imports: [],
  templateUrl: './uc-info.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-info.css',
})
export class UcInfo {
  variant = input<'info' | 'warning' | 'error'>('info');
}
