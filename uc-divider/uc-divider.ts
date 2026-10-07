import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { UC_DEFAULTS } from '../uc-defaults/uc-defaults';

export type UcDividerVariant = 'default' | 'inverse';

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
  variant = input<UcDividerVariant>(inject(UC_DEFAULTS).divider?.variant ?? 'default');
  vertical = input<boolean>(false);
  text = input<string>();
}
