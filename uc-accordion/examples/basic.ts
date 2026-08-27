import { Component } from '@angular/core';

import { UcAccordionItem } from '../uc-accordion-item';
import { UcAccordion } from '../uc-accordion';

@Component({
  selector: 'uc-accordion-basic-example',
  imports: [UcAccordion, UcAccordionItem],
  styles: `
    :host {
      display: block;
      width: 300px;
    }
  `,
  template: `
    <uc-accordion>
      <uc-accordion-item title="First Item">
        <ng-template #content>Content for the first accordion item.</ng-template>
      </uc-accordion-item>
      <uc-accordion-item title="Second Item">
        <ng-template #content>Content for the second accordion item.</ng-template>
      </uc-accordion-item>
      <uc-accordion-item title="Third Item">
        <ng-template #content>Content for the third accordion item.</ng-template>
      </uc-accordion-item>
    </uc-accordion>
  `,
})
export class AccordionBasicExample {}
