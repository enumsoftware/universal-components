import { bool, defineShowcase, text } from '../workbench/core';
import { UcSpinnerLoading } from './uc-spinner-loading.component';

export default defineShowcase({
  id: 'components/spinner-loading',
  group: 'Components',
  title: 'Spinner Loading',
  component: UcSpinnerLoading,
  knobs: {
    loading: bool(true),
    color: text(undefined),
    size: text(undefined, { placeholder: '2.5rem' }),
    thickness: text(undefined, { placeholder: '0.25rem' }),
  },
  examples: [
    { name: 'Not Loading', props: { loading: false } },
    { name: 'Custom Color', props: { loading: true, color: '#ff5733' } },
    { name: 'Custom Size', props: { loading: true, size: '4rem' } },
    { name: 'Custom Thickness', props: { loading: true, size: '4rem', thickness: '0.75rem' } },
  ],
});
