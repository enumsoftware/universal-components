import { bool, defineShowcase, text } from '../workbench/core';
import { OptimizedImagePreview } from './examples/optimized-image-preview';

export default defineShowcase({
  id: 'components/optimized-image',
  group: 'Components',
  title: 'Optimized Image',
  layout: 'padded',
  component: OptimizedImagePreview,
  knobs: {
    duration: text('0.4s', { description: 'The fade length, as --uc-optimized-image-duration.' }),
    priority: bool(false, { description: 'Priority images show at once, without a fade.' }),
  },
  examples: [
    { name: 'Slow Fade', props: { duration: '1.2s' } },
    { name: 'Priority', description: 'Shown at once, as the largest image on a page should be.', props: { priority: true } },
  ],
});
