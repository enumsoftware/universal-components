import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { UcStepper } from './uc-stepper';
import { UcStep } from './uc-step';

const meta: Meta<UcStepper> = {
  title: 'Components/Stepper',
  component: UcStepper,
  decorators: [
    moduleMetadata({
      imports: [UcStep],
    }),
  ],
  render: () => ({
    props: {},
    template: `
      <uc-stepper>
        <uc-step [label]="'Personal Info'">
          <ng-template>
            <p>Enter your personal information.</p>
          </ng-template>
        </uc-step>
        <uc-step [label]="'Account Details'">
          <ng-template>
            <p>Set up your account credentials.</p>
          </ng-template>
        </uc-step>
        <uc-step [label]="'Review'">
          <ng-template>
            <p>Review your information before submitting.</p>
          </ng-template>
        </uc-step>
      </uc-stepper>
    `,
  }),
};

export default meta;
type Story = StoryObj<UcStepper>;

export const Default: Story = {};
