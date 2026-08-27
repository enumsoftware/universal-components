import { Component } from '@angular/core';

import { UcPhosphorIcon } from '../../uc-phosphor-icon/uc-phosphor-icon';
import { UcPill } from '../../uc-pill/uc-pill';
import { UcAccordionItem } from '../uc-accordion-item';
import { UcAccordion } from '../uc-accordion';

/** The `#header` template replaces the plain `title` input entirely. */
@Component({
  selector: 'uc-accordion-custom-header-example',
  imports: [UcAccordion, UcAccordionItem, UcPhosphorIcon, UcPill],
  styles: `
    :host {
      display: block;
      width: 300px;
    }

    .uc-accordion-header-title {
      flex: 1;
    }

    uc-phosphor-icon {
      margin-inline-end: 0.5rem;
    }
  `,
  template: `
    <uc-accordion>
      <uc-accordion-item title="Plain title item">
        <ng-template #content>This item has no custom header, so it falls back to the plain title.</ng-template>
      </uc-accordion-item>
      <uc-accordion-item>
        <ng-template #header>
          <uc-phosphor-icon icon="rocket-launch" />
          <span class="uc-accordion-header-title">Custom header with icon</span>
          <uc-pill text="New" size="compact" />
        </ng-template>
        <ng-template #content>
          The header above is fully projected content (icon + title + pill), not just the title input.
        </ng-template>
      </uc-accordion-item>
      <uc-accordion-item title="Another plain item">
        <ng-template #content>Plain and custom headers can be mixed within the same accordion.</ng-template>
      </uc-accordion-item>
    </uc-accordion>
  `,
})
export class AccordionCustomHeaderExample {}
