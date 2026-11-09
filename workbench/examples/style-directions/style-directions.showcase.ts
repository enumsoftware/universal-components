import { defineShowcase } from '../../core';
import { WbStyleDirectionsExample } from './style-directions';

export default defineShowcase({
  id: 'examples/style-directions',
  group: 'Examples',
  title: 'Style Directions',
  order: 4,
  layout: 'padded',
  component: WbStyleDirectionsExample,
});
