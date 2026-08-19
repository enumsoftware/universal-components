import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-divider',
  imports: [],
  templateUrl: './uc-divider.html',
  styleUrl: './uc-divider.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[class.uc-divider--inverse]': "variant() === 'inverse'",
    '[class.uc-divider--vertical]': 'vertical()',
    '[class.uc-divider--with-text]': 'text()',
  },
})
export class UcDivider {
  variant = input<'default' | 'inverse'>('default');
  vertical = input<boolean>(false);
  text = input<string>();
}
