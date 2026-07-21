import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

export const PILL_VARIANT_OPTIONS = ['default', 'info', 'valid', 'error'] as const;
export type PillVariant = (typeof PILL_VARIANT_OPTIONS)[number];

export const PILL_SIZE_OPTIONS = ['default', 'compact'] as const;
export type PillSize = (typeof PILL_SIZE_OPTIONS)[number];

@Component({
  selector: 'uc-pill',
  imports: [],
  templateUrl: './uc-pill.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-pill.css',
})
export class UcPill {
  text = model<string | null>(null);
  href = input<string | null>(null);
  variant = input<PillVariant>('default');
  size = input<PillSize>('default');
  pillClick = output<void>();
}
