import { defineShowcase, number, text } from '../workbench/core';
import { InlineBottomSheetPreview } from './examples/inline-bottom-sheet-preview';

export default defineShowcase({
  id: 'components/bottom-sheet-inline',
  group: 'Components',
  title: 'Bottom Sheet (Inline)',
  layout: 'padded',
  component: InlineBottomSheetPreview,
  knobs: {
    label: text('Bus lines'),
    handleLabel: text('Sheet height'),
    snapIndex: number(0),
  },
  examples: [
    {
      name: 'Over a Map',
      description:
        'Drag the handle or the header between three heights, flick to skip to the next, or focus the handle and use the arrow keys. The stops behind stay clickable.',
      props: {},
    },
    // Its own label: both examples render on one page, and two regions with one name are indistinguishable.
    { name: 'Half Open', props: { snapIndex: 1, label: 'Bus lines, half open' } },
  ],
});
