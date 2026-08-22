import { propertyRules, range } from './shared.ts';
import type { Rule, UtilitySheet, ValueMap } from './types.ts';

const TRACK_SIZES: ValueMap = {
  auto: 'auto',
  min: 'min-content',
  max: 'max-content',
  fr: 'minmax(0, 1fr)',
};

const sheets: UtilitySheet[] = [
  {
    file: 'grid.css',
    module: 'grid',
    title: 'Grid',
    description: [
      'Explicit column and row templates, line-based item placement, auto flow and',
      'implicit track sizing. Alignment (uc-place-items-*, uc-justify-*, uc-items-*)',
      'lives in alignment.css.',
    ],
    requiresScale: false,
    groups: [
      {
        title: 'Grid template',
        responsive: true,
        rules: [
          // minmax(0, 1fr) rather than 1fr so a wide child cannot blow out its track.
          ...range(1, 12).map(
            (n): Rule => [`grid-cols-${n}`, [['grid-template-columns', `repeat(${n}, minmax(0, 1fr))`]]],
          ),
          ['grid-cols-none', [['grid-template-columns', 'none']]],
          ['grid-cols-subgrid', [['grid-template-columns', 'subgrid']]],
          ...range(1, 6).map((n): Rule => [`grid-rows-${n}`, [['grid-template-rows', `repeat(${n}, minmax(0, 1fr))`]]]),
          ['grid-rows-none', [['grid-template-rows', 'none']]],
          ['grid-rows-subgrid', [['grid-template-rows', 'subgrid']]],
        ],
      },
      {
        title: 'Grid item placement',
        responsive: true,
        rules: [
          ['col-auto', [['grid-column', 'auto']]],
          ['col-span-full', [['grid-column', '1 / -1']]],
          ...range(1, 12).map((n): Rule => [`col-span-${n}`, [['grid-column', `span ${n} / span ${n}`]]]),
          ['col-start-auto', [['grid-column-start', 'auto']]],
          ...range(1, 13).map((n): Rule => [`col-start-${n}`, [['grid-column-start', String(n)]]]),
          ['col-end-auto', [['grid-column-end', 'auto']]],
          ...range(1, 13).map((n): Rule => [`col-end-${n}`, [['grid-column-end', String(n)]]]),
          ['row-auto', [['grid-row', 'auto']]],
          ['row-span-full', [['grid-row', '1 / -1']]],
          ...range(1, 6).map((n): Rule => [`row-span-${n}`, [['grid-row', `span ${n} / span ${n}`]]]),
          ...range(1, 7).map((n): Rule => [`row-start-${n}`, [['grid-row-start', String(n)]]]),
          ...range(1, 7).map((n): Rule => [`row-end-${n}`, [['grid-row-end', String(n)]]]),
        ],
      },
      {
        title: 'Grid flow and implicit tracks',
        responsive: true,
        rules: [
          ['grid-flow-row', [['grid-auto-flow', 'row']]],
          ['grid-flow-col', [['grid-auto-flow', 'column']]],
          ['grid-flow-dense', [['grid-auto-flow', 'dense']]],
          ['grid-flow-row-dense', [['grid-auto-flow', 'row dense']]],
          ['grid-flow-col-dense', [['grid-auto-flow', 'column dense']]],
          ...propertyRules('auto-cols', 'grid-auto-columns', TRACK_SIZES),
          ...propertyRules('auto-rows', 'grid-auto-rows', TRACK_SIZES),
        ],
      },
    ],
  },
];

export default sheets;
