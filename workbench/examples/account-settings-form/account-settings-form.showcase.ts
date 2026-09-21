import { defineShowcase } from '../../core';
import { WbAccountSettingsFormExample } from './account-settings-form';

export default defineShowcase({
  id: 'examples/account-settings-form',
  group: 'Examples',
  title: 'Account Settings Form',
  order: 1,
  layout: 'padded',
  component: WbAccountSettingsFormExample,
});
