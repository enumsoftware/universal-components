import { defineShowcase } from '../workbench/core';
import { StepperPreview } from './examples/stepper-preview';

export default defineShowcase({
  id: 'components/stepper',
  group: 'Components',
  title: 'Stepper',
  layout: 'padded',
  component: StepperPreview,
});
