import { defineShowcase } from '../workbench/core';
import { UtilitiesSpacingPage } from './examples/spacing-page';

export default defineShowcase({
  id: 'utilities/spacing',
  group: 'Utilities',
  title: 'Spacing',
  order: 1,
  layout: 'padded',
  component: UtilitiesSpacingPage,
});
