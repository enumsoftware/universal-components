import { propertyRules } from './shared.ts';
import type { UtilitySheet, ValueMap } from './types.ts';

/**
 * Intrinsic keywords plus the two everyday percentages. Fixed step sizes are
 * deliberately absent - components own their own dimensions, and the layer only
 * needs to let a caller say "span the container" or "shrink to the content".
 */
const WIDTH: ValueMap = {
  full: '100%',
  half: '50%',
  auto: 'auto',
  fit: 'fit-content',
  min: 'min-content',
  max: 'max-content',
};

const HEIGHT: ValueMap = {
  full: '100%',
  auto: 'auto',
  fit: 'fit-content',
  min: 'min-content',
  max: 'max-content',
};

const sheets: UtilitySheet[] = [
  {
    file: 'sizing.css',
    module: 'sizing',
    title: 'Sizing',
    description: [
      'Width and height helpers, plus the box-sizing switch they depend on.',
      'A percentage width only behaves as expected on a padded element when the',
      'padding is inside the box, so pair uc-w-full with uc-box-border unless the',
      'element already sets border-box itself (uc-card does).',
    ],
    requiresScale: false,
    groups: [
      {
        title: 'Width',
        responsive: true,
        rules: propertyRules('w', 'width', WIDTH),
      },
      {
        title: 'Height',
        responsive: true,
        rules: propertyRules('h', 'height', HEIGHT),
      },
      {
        title: 'Max size',
        responsive: true,
        rules: [
          ['max-w-full', [['max-width', '100%']]],
          ['max-w-none', [['max-width', 'none']]],
          ['max-h-full', [['max-height', '100%']]],
          ['max-h-none', [['max-height', 'none']]],
        ],
      },
      {
        title: 'Box sizing',
        responsive: false,
        rules: [
          ['box-border', [['box-sizing', 'border-box']]],
          ['box-content', [['box-sizing', 'content-box']]],
        ],
      },
    ],
  },
];

export default sheets;
