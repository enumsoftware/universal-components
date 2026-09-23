import { bool, defineShowcase, select, text } from '../workbench/core';
import {
  BUTTON_ALIGN_OPTIONS,
  BUTTON_SIZE_OPTIONS,
  BUTTON_TYPE_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
  UcButton,
} from './uc-button';
import { ConsumerOwnedSignalExample } from './examples/consumer-owned-signal';
import { LoadingSizesExample } from './examples/loading-sizes';
import { LoadingVariantsExample } from './examples/loading-variants';
import { SizesExample } from './examples/sizes';
import { TableActionsExample } from './examples/table-actions';
import { ToggleExample } from './examples/toggle';
import { VariantsExample } from './examples/variants';
import { WithIconsExample } from './examples/with-icons';

export default defineShowcase({
  id: 'components/button',
  group: 'Components',
  title: 'Button',
  component: UcButton,
  knobs: {
    text: text('Click Me'),
    variant: select(BUTTON_VARIANT_OPTIONS, 'primary'),
    size: select(BUTTON_SIZE_OPTIONS, 'medium'),
    align: select(BUTTON_ALIGN_OPTIONS, 'center'),
    type: select(BUTTON_TYPE_OPTIONS, 'button'),
    disabled: bool(false),
    loading: bool(false),
    isToggleEnabled: bool(false, {
      description: 'Turns the button into a toggle; its on/off styling replaces the variant.',
    }),
    pressed: bool(false, { description: 'Toggle state; only applies with isToggleEnabled.' }),
    loadingText: text(undefined, {
      placeholder: 'Leave empty to keep the resting width',
    }),
  },
  examples: [
    {
      name: 'Variants',
      description: 'A row on desktop, a full-width stack under 768px.',
      component: VariantsExample,
    },
    { name: 'Sizes', component: SizesExample },
    { name: 'With Icons', component: WithIconsExample },
    { name: 'Table Actions', component: TableActionsExample },
    { name: 'Loading Variants', component: LoadingVariantsExample },
    { name: 'Loading Sizes', component: LoadingSizesExample },
    {
      name: 'Loading With Text',
      description: 'Setting `loadingText` swaps the label, which reflows the button.',
      props: { text: 'Save invoice', loading: true, loadingText: 'Saving…' },
    },
    {
      name: 'Consumer Owned Signal',
      description: 'Repeated clicks show the button refuses to re-emit while a request is in flight.',
      component: ConsumerOwnedSignalExample,
    },
    {
      name: 'Toggle',
      description: 'With `isToggleEnabled`, `[(pressed)]` flips on click and sets `aria-pressed`.',
      component: ToggleExample,
    },
  ],
});
