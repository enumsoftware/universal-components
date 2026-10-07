import { defineShowcase } from '../workbench/core';
import { IsDevelopmentPreview } from './examples/is-development-preview';

export default defineShowcase({
  id: 'components/is-development',
  group: 'Components',
  title: 'Is Development',
  layout: 'padded',
  component: IsDevelopmentPreview,
});
