import { defineShowcase, number, object, select, text } from '../workbench/core';
import { BREADCRUMBS_VARIANT_OPTIONS } from './uc-breadcrumbs';
import { BreadcrumbsPreview } from './examples/breadcrumbs-preview';
import { CustomSeparatorExample } from './examples/custom-separator';
import { WithIconsExample } from './examples/with-icons';

const LONG_TRAIL = ['Home', 'Catalog', 'Clothing', 'Men', 'Shoes', 'Running', 'Trail'];

export default defineShowcase({
  id: 'components/breadcrumbs',
  group: 'Components',
  title: 'Breadcrumbs',
  layout: 'padded',
  component: BreadcrumbsPreview,
  knobs: {
    crumbs: object(['Home', 'Catalog', 'Accessories']),
    variant: select(BREADCRUMBS_VARIANT_OPTIONS, 'plain'),
    separator: text('/'),
    label: text('Breadcrumb'),
    maxItems: number(8, { min: 1 }),
    itemsBeforeCollapse: number(1, { min: 0 }),
    itemsAfterCollapse: number(1, { min: 0 }),
    expandText: text('Show path'),
  },
  examples: [
    { name: 'Pills', props: { variant: 'pills', label: 'Breadcrumb, pills' } },
    {
      name: 'Collapsed',
      description: 'Past `maxItems`, the middle crumbs collapse behind a button that expands the full path.',
      props: {
        crumbs: LONG_TRAIL,
        maxItems: 4,
        label: 'Breadcrumb, collapsed',
      },
    },
    {
      name: 'Collapsed, Two Each Side',
      description: '`itemsBeforeCollapse` and `itemsAfterCollapse` choose how many crumbs stay on each side.',
      props: {
        crumbs: LONG_TRAIL,
        maxItems: 4,
        itemsBeforeCollapse: 2,
        itemsAfterCollapse: 2,
        label: 'Breadcrumb, two each side',
      },
    },
    { name: 'Custom Separator', component: CustomSeparatorExample },
    { name: 'With Icons', component: WithIconsExample },
  ],
});
