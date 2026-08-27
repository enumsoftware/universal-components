import { defineShowcase, select, text } from '../workbench/core';
import { TooltipPositionsExample, TooltipPreview } from './examples/tooltip-previews';
import type { UcTooltipPosition } from './uc-tooltip';

const POSITIONS: (UcTooltipPosition | undefined)[] = [
  undefined,
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'right',
];

export default defineShowcase({
  id: 'components/tooltip',
  group: 'Components',
  title: 'Tooltip',
  layout: 'padded',
  component: TooltipPreview,
  knobs: {
    message: text('This is a helpful tooltip'),
    position: select(POSITIONS, undefined, { description: 'Unset lets the tooltip pick a side.' }),
    margin: text(undefined, { placeholder: 'Gap from the anchor, e.g. 24px' }),
  },
  examples: [
    {
      name: 'Long Text',
      props: { message: 'This is a longer tooltip with more detailed information for the user.' },
    },
    { name: 'Positions', component: TooltipPositionsExample },
    {
      name: 'Custom Margin',
      props: { message: 'Tooltip with a larger gap from the anchor', margin: '24px' },
    },
  ],
});
