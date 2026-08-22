import { CONTENT_ALIGNMENT, ITEM_ALIGNMENT, propertyRules } from './shared.ts';
import type { UtilitySheet, ValueMap } from './types.ts';

const BOX_ALIGNMENT: ValueMap = {
  start: 'start',
  end: 'end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
};

const PLACE_CONTENT: ValueMap = {
  ...CONTENT_ALIGNMENT,
  start: 'start',
  end: 'end',
};

const SELF_ALIGNMENT: ValueMap = { auto: 'auto', ...ITEM_ALIGNMENT };

const JUSTIFY_SELF: ValueMap = {
  auto: 'auto',
  start: 'start',
  end: 'end',
  center: 'center',
  stretch: 'stretch',
};

const JUSTIFY_ITEMS: ValueMap = {
  start: 'start',
  end: 'end',
  center: 'center',
  stretch: 'stretch',
};

const sheets: UtilitySheet[] = [
  {
    file: 'alignment.css',
    module: 'alignment',
    title: 'Alignment',
    description: [
      'Box alignment for both flex and grid containers, which is why it is its own',
      'sheet: importing only flex.css or only grid.css still needs these classes.',
    ],
    requiresScale: false,
    groups: [
      {
        title: 'Justify content',
        responsive: true,
        rules: propertyRules('justify', 'justify-content', CONTENT_ALIGNMENT),
      },
      {
        title: 'Align items',
        responsive: true,
        rules: propertyRules('items', 'align-items', ITEM_ALIGNMENT),
      },
      {
        title: 'Align content',
        responsive: true,
        rules: propertyRules('content', 'align-content', CONTENT_ALIGNMENT),
      },
      {
        title: 'Self alignment',
        responsive: true,
        rules: [
          ...propertyRules('self', 'align-self', SELF_ALIGNMENT),
          ...propertyRules('justify-self', 'justify-self', JUSTIFY_SELF),
        ],
      },
      {
        title: 'Box alignment shorthands',
        responsive: true,
        rules: [
          ...propertyRules('justify-items', 'justify-items', JUSTIFY_ITEMS),
          ...propertyRules('place-items', 'place-items', BOX_ALIGNMENT),
          ...propertyRules('place-content', 'place-content', PLACE_CONTENT),
        ],
      },
    ],
  },
];

export default sheets;
