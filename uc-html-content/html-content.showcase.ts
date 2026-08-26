import { defineShowcase } from '../workbench/core';
import { HtmlContentPreview } from './examples/html-content-preview';

export default defineShowcase({
  id: 'foundations/html-content',
  group: 'Foundations',
  title: 'HTML Content',
  layout: 'padded',
  component: HtmlContentPreview,
});
