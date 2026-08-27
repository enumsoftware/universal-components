import { bool, defineShowcase, select, text } from '../workbench/core';
import { InverseSurfaceExample } from './examples/inverse-surface';
import { VerticalExample } from './examples/vertical';
import { UcDivider } from './uc-divider';

export default defineShowcase({
  id: 'components/divider',
  group: 'Components',
  title: 'Divider',
  // Padded rather than centred: a horizontal divider takes its width from the
  // container, so it needs a block context rather than a hardcoded wrapper.
  layout: 'padded',
  component: UcDivider,
  knobs: {
    variant: select(['default', 'inverse'] as const, 'default'),
    vertical: bool(false),
    text: text(undefined, { placeholder: 'Optional label in the middle' }),
  },
  examples: [
    { name: 'With Text', props: { text: 'or' } },
    { name: 'Inverse', component: InverseSurfaceExample },
    { name: 'Vertical', component: VerticalExample },
  ],
});
