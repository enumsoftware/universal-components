import { defineShowcase, select, text } from '../workbench/core';
import { PHOSPHOR_ICON_WEIGHT_OPTIONS, UcPhosphorIcon } from './uc-phosphor-icon';

export default defineShowcase({
  id: 'components/phosphor-icon',
  group: 'Components',
  title: 'Phosphor Icon',
  component: UcPhosphorIcon,
  knobs: {
    icon: text('house', { description: 'Phosphor icon name, without the ph- prefix.' }),
    weight: select(PHOSPHOR_ICON_WEIGHT_OPTIONS, 'regular'),
  },
  examples: [
    { name: 'Bold', props: { icon: 'gear', weight: 'bold' } },
    { name: 'Fill', props: { icon: 'heart', weight: 'fill' } },
  ],
});
