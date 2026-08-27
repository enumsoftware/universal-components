import { bool, defineShowcase, number, text } from '../workbench/core';
import { UcSlider } from './uc-slider';

export default defineShowcase({
  id: 'components/slider',
  group: 'Components',
  title: 'Slider',
  component: UcSlider,
  knobs: {
    id: text('slider-1'),
    label: text('Volume'),
    min: number(0),
    max: number(100),
    step: number(1),
    value: number(50),
    showValue: bool(true),
    disabled: bool(false),
  },
  examples: [
    { name: 'Disabled', props: { disabled: true } },
    { name: 'With Steps', props: { label: 'Rating', min: 1, max: 5, step: 1, value: 3 } },
  ],
});
