import { Component, input } from '@angular/core';

@Component({
  selector: 'uc-info',
  imports: [],
  templateUrl: './uc-info.html',
  styleUrl: './uc-info.scss',
})
export class UcInfo {
  variant = input<'info' | 'warning' | 'error'>('info');
}
