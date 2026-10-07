import { bool, defineShowcase, number, select, text } from '../workbench/core';
import {
  BadgePositionsExample,
  BadgePreview,
  BadgeSizesExample,
  BadgeVariantsExample,
} from './examples/badge-previews';
import { BADGE_POSITION_OPTIONS, BADGE_SIZE_OPTIONS, BADGE_VARIANT_OPTIONS } from './uc-badge';

export default defineShowcase({
  id: 'components/badge',
  group: 'Components',
  title: 'Badge',
  layout: 'padded',
  component: BadgePreview,
  knobs: {
    content: text('4', { description: 'An empty value hides the badge, except at small size.' }),
    position: select(BADGE_POSITION_OPTIONS, 'top-end'),
    size: select(BADGE_SIZE_OPTIONS, 'medium'),
    variant: select(BADGE_VARIANT_OPTIONS, 'error'),
    overlap: bool(true),
    hidden: bool(false),
    disabled: bool(false),
    max: number<number | null>(99, { description: 'Counts above this show as max+.' }),
    description: text('4 unread messages', { description: 'Read by screen readers instead of the count.' }),
  },
  examples: [
    { name: 'Positions', component: BadgePositionsExample },
    { name: 'Sizes', component: BadgeSizesExample },
    { name: 'Variants', component: BadgeVariantsExample },
    { name: 'Capped Count', props: { content: '250', max: 99 } },
  ],
});
