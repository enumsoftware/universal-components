import { Component } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** The pair a table row uses: a small primary next to a small secondary. */
@Component({
  selector: 'uc-button-table-actions-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Edit" variant="primary" size="small">
      <i ucButtonPrefix class="ph-bold ph-pencil"></i>
    </uc-button>
    <uc-button text="View" variant="secondary" size="small">
      <i ucButtonPrefix class="ph-bold ph-eye"></i>
    </uc-button>
  `,
})
export class TableActionsExample {}
