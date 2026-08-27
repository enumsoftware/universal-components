import { defineShowcase } from '../workbench/core';
import { UtilitiesFlexPage } from './examples/flex-page';

export default defineShowcase({
  id: 'utilities/flex',
  group: 'Utilities',
  title: 'Flex',
  order: 2,
  layout: 'padded',
  component: UtilitiesFlexPage,
});
