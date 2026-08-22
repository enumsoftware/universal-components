import { range } from './shared.ts';
import type { Rule, UtilitySheet } from './types.ts';

const sheets: UtilitySheet[] = [
  {
    file: 'flex.css',
    module: 'flex',
    title: 'Flex',
    description: [
      'Flex container direction and wrapping, plus per-item sizing and order.',
      'Alignment (uc-justify-*, uc-items-*, uc-self-*) lives in alignment.css because',
      'grid containers use the same classes.',
    ],
    requiresScale: false,
    groups: [
      {
        title: 'Flex direction',
        responsive: true,
        rules: [
          ['flex-row', [['flex-direction', 'row']]],
          ['flex-row-reverse', [['flex-direction', 'row-reverse']]],
          ['flex-col', [['flex-direction', 'column']]],
          ['flex-col-reverse', [['flex-direction', 'column-reverse']]],
        ],
      },
      {
        title: 'Flex wrap',
        responsive: true,
        rules: [
          ['flex-wrap', [['flex-wrap', 'wrap']]],
          ['flex-wrap-reverse', [['flex-wrap', 'wrap-reverse']]],
          ['flex-nowrap', [['flex-wrap', 'nowrap']]],
        ],
      },
      {
        title: 'Flex item sizing',
        responsive: true,
        rules: [
          ['flex-1', [['flex', '1 1 0%']]],
          ['flex-auto', [['flex', '1 1 auto']]],
          ['flex-initial', [['flex', '0 1 auto']]],
          ['flex-none', [['flex', '0 0 auto']]],
          ['grow', [['flex-grow', '1']]],
          ['grow-0', [['flex-grow', '0']]],
          ['shrink', [['flex-shrink', '1']]],
          ['shrink-0', [['flex-shrink', '0']]],
          ['basis-0', [['flex-basis', '0%']]],
          ['basis-auto', [['flex-basis', 'auto']]],
          ['basis-full', [['flex-basis', '100%']]],
          ['basis-1-2', [['flex-basis', '50%']]],
          ['basis-1-3', [['flex-basis', '33.333333%']]],
          ['basis-2-3', [['flex-basis', '66.666667%']]],
          ['basis-1-4', [['flex-basis', '25%']]],
          ['basis-3-4', [['flex-basis', '75%']]],
          ['min-w-0', [['min-width', '0']]],
          ['min-h-0', [['min-height', '0']]],
        ],
      },
      {
        title: 'Order',
        responsive: true,
        rules: [
          ['order-first', [['order', '-9999']]],
          ['order-last', [['order', '9999']]],
          ['order-none', [['order', '0']]],
          ...range(1, 12).map((n): Rule => [`order-${n}`, [['order', String(n)]]]),
        ],
      },
    ],
  },
];

export default sheets;
