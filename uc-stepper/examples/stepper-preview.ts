import { Component } from '@angular/core';

import { UcStep } from '../uc-step';
import { UcStepper } from '../uc-stepper';

@Component({
  selector: 'uc-stepper-preview',
  imports: [UcStep, UcStepper],
  template: `
    <uc-stepper>
      <uc-step label="Personal Info">
        <ng-template>
          <p>Enter your personal information.</p>
        </ng-template>
      </uc-step>
      <uc-step label="Account Details">
        <ng-template>
          <p>Set up your account credentials.</p>
        </ng-template>
      </uc-step>
      <uc-step label="Review">
        <ng-template>
          <p>Review your information before submitting.</p>
        </ng-template>
      </uc-step>
    </uc-stepper>
  `,
})
export class StepperPreview {}
