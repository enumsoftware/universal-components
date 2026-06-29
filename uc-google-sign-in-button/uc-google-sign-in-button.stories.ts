import type { Meta, StoryObj } from '@storybook/angular';
import { UcGoogleSignInButton } from './uc-google-sign-in-button';

const meta: Meta<UcGoogleSignInButton> = {
  title: 'Components/Google Sign In Button',
  component: UcGoogleSignInButton,
  args: {
    apiBaseUrl: '/api',
  },
};

export default meta;
type Story = StoryObj<UcGoogleSignInButton>;

export const Default: Story = {};

export const WithReturnUrl: Story = {
  args: {
    returnUrl: '/dashboard',
  },
};
