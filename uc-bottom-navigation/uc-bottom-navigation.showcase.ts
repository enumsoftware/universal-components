import { bool, defineShowcase, number, text } from '../workbench/core';
import { BadgeExample, IconOnlyExample } from './examples/bottom-navigation-examples';
import { BottomNavigationPreview } from './examples/bottom-navigation-preview';

export default defineShowcase({
  id: 'components/bottom-navigation',
  group: 'Components',
  title: 'Bottom Navigation',
  layout: 'padded',
  component: BottomNavigationPreview,
  knobs: {
    label: text('Main navigation'),
    showLabels: bool(true),
    fixed: bool(false),
    hideFrom: number(0),
  },
  examples: [
    {
      name: 'Default',
      description: "Four destinations, the current one with a filled icon on a pill in the theme's primary colour.",
      props: {},
    },
    { name: 'Badge', component: BadgeExample },
    { name: 'Icon Only', component: IconOnlyExample },
  ],
});
