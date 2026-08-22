import type { UtilitySheet } from './types.ts';

const AUTO_TRACKS = 'minmax(min(var(--uc-grid-min), 100%), 1fr)';

const sheets: UtilitySheet[] = [
  {
    file: 'composites.css',
    module: 'composites',
    title: 'Composites',
    description: [
      'Multi-property shorthands for layouts that come up constantly. These are',
      'base-breakpoint only - compose the single-purpose classes when you need a',
      'composite to change at a breakpoint.',
    ],
    requiresScale: false,
    groups: [
      {
        title: 'Layout composites',
        responsive: false,
        rules: [
          [
            'flex-center',
            [
              ['display', 'flex'],
              ['align-items', 'center'],
              ['justify-content', 'center'],
            ],
          ],
          [
            'flex-col-center',
            [
              ['display', 'flex'],
              ['flex-direction', 'column'],
              ['align-items', 'center'],
              ['justify-content', 'center'],
            ],
          ],
          [
            'flex-between',
            [
              ['display', 'flex'],
              ['align-items', 'center'],
              ['justify-content', 'space-between'],
            ],
          ],
          // Responsive track counts with no media query. min() keeps a single
          // column from overflowing a container narrower than --uc-grid-min.
          [
            'grid-auto-fit',
            [
              ['display', 'grid'],
              ['grid-template-columns', `repeat(auto-fit, ${AUTO_TRACKS})`],
            ],
          ],
          [
            'grid-auto-fill',
            [
              ['display', 'grid'],
              ['grid-template-columns', `repeat(auto-fill, ${AUTO_TRACKS})`],
            ],
          ],
        ],
      },
    ],
  },
];

export default sheets;
