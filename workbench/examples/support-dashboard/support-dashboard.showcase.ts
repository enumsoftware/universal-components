import { defineShowcase } from '../../core';
import { WbSupportDashboardExample } from './support-dashboard';

export default defineShowcase({
  id: 'examples/support-dashboard',
  group: 'Examples',
  title: 'Support Dashboard',
  order: 3,
  layout: 'padded',
  component: WbSupportDashboardExample,
});
