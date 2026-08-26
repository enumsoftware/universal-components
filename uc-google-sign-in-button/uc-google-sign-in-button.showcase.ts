import { defineShowcase, text } from '../workbench/core';
import { UcGoogleSignInButton } from './uc-google-sign-in-button';

export default defineShowcase({
  id: 'components/google-sign-in-button',
  group: 'Components',
  title: 'Google Sign In Button',
  component: UcGoogleSignInButton,
  knobs: {
    apiBaseUrl: text('/api'),
    returnUrl: text(undefined, { placeholder: 'Where to land after sign in' }),
  },
  examples: [{ name: 'With Return Url', props: { returnUrl: '/dashboard' } }],
});
