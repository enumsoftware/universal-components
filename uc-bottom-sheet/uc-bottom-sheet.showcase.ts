import { bool, defineShowcase, text } from '../workbench/core';
import { BottomSheetPreview } from './examples/bottom-sheet-preview';
import { TemplateSheetExample } from './examples/template-sheet-example';

export default defineShowcase({
  id: 'components/bottom-sheet',
  group: 'Components',
  title: 'Bottom Sheet',
  component: BottomSheetPreview,
  knobs: {
    ariaLabel: text('Share this page'),
    hasBackdrop: bool(true),
    disableClose: bool(false),
  },
  examples: [
    {
      name: 'Actions',
      description: 'A list of actions; picking one dismisses the sheet with its key, Escape or the backdrop with nothing.',
      props: {},
    },
    {
      name: 'Disable Close',
      description: 'Escape and the backdrop are ignored, so the sheet only closes through its own buttons.',
      props: { disableClose: true },
    },
    { name: 'From a Template', component: TemplateSheetExample },
  ],
});
