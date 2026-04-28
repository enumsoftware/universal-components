import { Component, input } from '@angular/core';

@Component({
  selector: 'uc-divider',
  imports: [],
  templateUrl: './uc-divider.html',
  styleUrl: './uc-divider.scss',
  host: {
    '[class.uc-divider--inverse]': 'inverse()',
    '[class.uc-divider--vertical]': 'vertical()',
    '[class.uc-divider--with-text]': 'text()',
  },
})
export class UcDivider {
  inverse = input<boolean>(false);
  vertical = input<boolean>(false);
  text = input<string>();
}
