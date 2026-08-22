import { NEGATABLE_KEYS, SPACE_KEYS, negativeSpace, space, spacingRules } from './shared.ts';
import type { SideMap, UtilitySheet } from './types.ts';

/**
 * Sides map to CSS logical properties, so ms/me follow the writing direction
 * and flip automatically in RTL documents.
 */
const MARGIN_SIDES: SideMap = {
  m: ['margin'],
  mx: ['margin-inline'],
  my: ['margin-block'],
  mt: ['margin-block-start'],
  mb: ['margin-block-end'],
  ms: ['margin-inline-start'],
  me: ['margin-inline-end'],
};

const PADDING_SIDES: SideMap = {
  p: ['padding'],
  px: ['padding-inline'],
  py: ['padding-block'],
  pt: ['padding-block-start'],
  pb: ['padding-block-end'],
  ps: ['padding-inline-start'],
  pe: ['padding-inline-end'],
};

const GAP_SIDES: SideMap = {
  gap: ['gap'],
  'gap-x': ['column-gap'],
  'gap-y': ['row-gap'],
};

const sheets: UtilitySheet[] = [
  {
    file: 'gap.css',
    module: 'spacing',
    title: 'Gap',
    description: ['Row and column gaps for flex and grid containers.'],
    requiresScale: true,
    groups: [
      {
        title: 'Gap',
        responsive: true,
        rules: spacingRules(GAP_SIDES, space, SPACE_KEYS),
      },
    ],
  },
  {
    file: 'margin.css',
    module: 'spacing',
    title: 'Margin',
    description: ['Outer spacing, including auto margins and negative steps.'],
    requiresScale: true,
    groups: [
      {
        title: 'Margin',
        responsive: true,
        rules: [
          ...spacingRules(MARGIN_SIDES, space, SPACE_KEYS),
          ...spacingRules(MARGIN_SIDES, () => 'auto', ['auto']),
        ],
      },
      {
        title: 'Negative margin (base breakpoint only)',
        responsive: false,
        rules: spacingRules(MARGIN_SIDES, negativeSpace, NEGATABLE_KEYS, { negative: true }),
      },
    ],
  },
  {
    file: 'padding.css',
    module: 'spacing',
    title: 'Padding',
    description: ['Inner spacing on all sides, both axes, and single logical sides.'],
    requiresScale: true,
    groups: [
      {
        title: 'Padding',
        responsive: true,
        rules: spacingRules(PADDING_SIDES, space, SPACE_KEYS),
      },
    ],
  },
];

export default sheets;
