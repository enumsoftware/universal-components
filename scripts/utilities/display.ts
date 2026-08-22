import type { UtilitySheet } from './types.ts';

const sheets: UtilitySheet[] = [
  {
    file: 'display.css',
    module: 'display',
    title: 'Display',
    description: ['Sets the outer and inner display type of an element.'],
    requiresScale: false,
    groups: [
      {
        title: 'Display',
        responsive: true,
        rules: [
          ['block', [['display', 'block']]],
          ['inline-block', [['display', 'inline-block']]],
          ['inline', [['display', 'inline']]],
          ['flex', [['display', 'flex']]],
          ['inline-flex', [['display', 'inline-flex']]],
          ['grid', [['display', 'grid']]],
          ['inline-grid', [['display', 'inline-grid']]],
          ['contents', [['display', 'contents']]],
          ['hidden', [['display', 'none']]],
        ],
      },
    ],
  },
];

export default sheets;
