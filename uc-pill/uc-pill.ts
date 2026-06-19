import { Component, model, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-pill',
  imports: [],
  templateUrl: './uc-pill.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-pill.css',
})
export class UcPill {
  text = model.required<string>();
}
