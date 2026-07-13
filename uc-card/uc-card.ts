import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export const CARD_FIT_OPTIONS = ['fit', 'fill'] as const;
export type CardFit = (typeof CARD_FIT_OPTIONS)[number];

@Component({
  selector: 'uc-card',
  imports: [],
  templateUrl: './uc-card.html',
  styleUrl: './uc-card.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[class.uc-card--fill]': 'fit() === "fill"',
  },
})
export class UcCard {
  fit = input<CardFit>('fit');
}
