import { defineShowcase, select, text } from '../workbench/core';
import { CARD_FIT_OPTIONS } from './uc-card';
import { CardPreview } from './examples/card-preview';

export default defineShowcase({
  id: 'components/card',
  group: 'Components',
  title: 'Card',
  layout: 'padded',
  component: CardPreview,
  knobs: {
    fit: select(CARD_FIT_OPTIONS, 'fit'),
    content: text('Card content preview'),
  },
  examples: [{ name: 'Fill', props: { fit: 'fill', content: 'Fill mode card preview' } }],
});
