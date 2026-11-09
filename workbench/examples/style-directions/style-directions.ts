import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UcButton } from '../../../uc-button/uc-button';
import { UcCard } from '../../../uc-card/uc-card';
import { UcPhosphorIcon } from '../../../uc-phosphor-icon/uc-phosphor-icon';
import { UcPill } from '../../../uc-pill/uc-pill';

interface ForgeRow {
  readonly icon: string;
  readonly name: string;
}

/**
 * One hero per style-direction theme, each scoped with its own `data-theme`, so
 * all six render side by side whatever the app theme is. Colour, type and shape
 * come from the theme tokens only; the page adds layout and a few decorative
 * shapes painted in those same tokens.
 */
@Component({
  selector: 'wb-style-directions-example',
  imports: [UcButton, UcCard, UcPhosphorIcon, UcPill],
  templateUrl: './style-directions.html',
  styleUrl: './style-directions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WbStyleDirectionsExample {
  protected readonly forgeRows: readonly ForgeRow[] = [
    { icon: 'folder', name: 'src' },
    { icon: 'file-text', name: 'README.md' },
  ];
  protected readonly bars = [30, 55, 45, 85];
}
