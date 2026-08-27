import { defineShowcase } from '../workbench/core';
import { UtilitiesOverviewPage } from './examples/overview-page';

export default defineShowcase({
  id: 'utilities/overview',
  group: 'Utilities',
  title: 'Overview',
  order: 0,
  layout: 'padded',
  component: UtilitiesOverviewPage,
});
