import { bool, defineShowcase, select } from '../workbench/core';
import { ANCHOR_VARIANT_OPTIONS, UcAnchor } from './uc-anchor';
import { DisabledExample } from './examples/disabled';
import { VariantsExample } from './examples/variants';

/**
 * The Playground canvas renders a bare `<a ucAnchor>` with no projected content, since
 * `ucAnchor` has no text input to drive - its content is real projected children. The knobs
 * still show variant and disabled on an (unlabelled) live element; the Examples tab has the
 * real, legible pictures.
 */
export default defineShowcase({
  id: 'components/anchor',
  group: 'Components',
  title: 'Anchor',
  component: UcAnchor,
  knobs: {
    variant: select(ANCHOR_VARIANT_OPTIONS, 'primary'),
    disabled: bool(false),
  },
  examples: [
    {
      name: 'Variants',
      description: 'A row on desktop, a full-width stack under 768px.',
      component: VariantsExample,
    },
    {
      name: 'Disabled',
      description: 'A disabled anchor loses its `href` rather than just dimming.',
      component: DisabledExample,
    },
  ],
});
