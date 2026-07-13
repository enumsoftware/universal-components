import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export const INFO_VARIANT_OPTIONS = ['info', 'warning', 'error'] as const;
export type InfoVariant = (typeof INFO_VARIANT_OPTIONS)[number];

@Component({
  selector: 'uc-info',
  imports: [],
  templateUrl: './uc-info.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-info.css',
})
export class UcInfo {
  variant = input<InfoVariant>('info');
}
