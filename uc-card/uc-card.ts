import { Component, input, ChangeDetectionStrategy } from '@angular/core';

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
  fit = input<'fit' | 'fill'>('fit');
}
