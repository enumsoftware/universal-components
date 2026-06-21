import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkStepper, STEP_STATE } from '@angular/cdk/stepper';

@Component({
  selector: 'uc-stepper',
  templateUrl: './uc-stepper.html',
  styleUrl: './uc-stepper.css',
  imports: [NgTemplateOutlet],
  providers: [{ provide: CdkStepper, useExisting: UcStepper }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UcStepper extends CdkStepper {
  readonly STEP_STATE = STEP_STATE;
}
