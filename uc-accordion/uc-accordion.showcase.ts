import { defineShowcase } from '../workbench/core';
import { AccordionBasicExample } from './examples/basic';
import { AccordionCustomHeaderExample } from './examples/custom-header';

export default defineShowcase({
  id: 'components/accordion',
  group: 'Components',
  title: 'Accordion',
  layout: 'padded',
  component: AccordionBasicExample,
  examples: [{ name: 'Custom Header', component: AccordionCustomHeaderExample }],
});
