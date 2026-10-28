import { defineShowcase } from '../workbench/core';
import { ThemeColorsPreview } from './examples/theme-colors-preview';

export default defineShowcase({
  id: 'foundations/theme-colors',
  group: 'Foundations',
  title: 'Theme Colors',
  layout: 'padded',
  component: ThemeColorsPreview,
});
