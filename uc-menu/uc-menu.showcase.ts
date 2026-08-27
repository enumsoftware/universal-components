import { defineShowcase } from '../workbench/core';
import { MenuBasicExample, MenuDirectiveItemsExample, MenuNativeTriggerExample } from './examples/menu-previews';

export default defineShowcase({
  id: 'components/menu',
  group: 'Components',
  title: 'Menu',
  layout: 'padded',
  component: MenuBasicExample,
  examples: [
    { name: 'With Native Button Trigger', component: MenuNativeTriggerExample },
    { name: 'With Directive Items', component: MenuDirectiveItemsExample },
  ],
});
