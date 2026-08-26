import { bool, defineShowcase, select, text } from '../workbench/core';
import { ICON_BUTTON_VARIANT_OPTIONS } from './uc-icon-button';
import { IconButtonInverseExample } from './examples/inverse';
import { IconButtonToggleExample } from './examples/toggle';
import { UcIconButton } from './uc-icon-button';

export default defineShowcase({
  id: 'components/icon-button',
  group: 'Components',
  title: 'Icon Button',
  component: UcIconButton,
  knobs: {
    label: text('Edit item', { description: 'Accessible name; the button shows only an icon.' }),
    phosphorIcon: text('pencil'),
    phosphorWeight: text('bold'),
    variant: select(ICON_BUTTON_VARIANT_OPTIONS, 'primary'),
    disabled: bool(false),
    inverseColor: bool(false),
  },
  examples: [
    { name: 'Secondary', props: { variant: 'secondary' } },
    { name: 'Error', props: { variant: 'error', phosphorIcon: 'trash' } },
    { name: 'Disabled', props: { disabled: true } },
    { name: 'Toggle', component: IconButtonToggleExample },
    { name: 'Inverse', component: IconButtonInverseExample },
  ],
});
