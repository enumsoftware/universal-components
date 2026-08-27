import { defineShowcase } from '../workbench/core';
import { UtilitiesGridPage } from './examples/grid-page';

export default defineShowcase({
  id: 'utilities/grid',
  group: 'Utilities',
  title: 'Grid',
  order: 3,
  layout: 'padded',
  component: UtilitiesGridPage,
});
