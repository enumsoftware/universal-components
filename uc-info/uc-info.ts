import { Component, input } from '@angular/core';

@Component({
  selector: 'uc-info',
  imports: [],
  templateUrl: './uc-info.html',
  styleUrl: './uc-info.css',
})
export class UcInfo {
  variant = input<'info' | 'warning' | 'error'>('info');
}
