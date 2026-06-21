import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CdkStep } from '@angular/cdk/stepper';

@Component({
  selector: 'uc-step',
  templateUrl: './uc-step.html',
  styleUrl: './uc-step.css',
  providers: [{ provide: CdkStep, useExisting: UcStep }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UcStep extends CdkStep {}
