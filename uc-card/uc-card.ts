import { Component, input } from '@angular/core';

@Component({
  selector: 'uc-card',
  imports: [],
  templateUrl: './uc-card.html',
  styleUrl: './uc-card.scss',
  host: {
    '[class.uc-card--fill]': 'fit() === "fill"',
  },
})
export class UcCard {
  fit = input<'fit' | 'fill'>('fit');
}
