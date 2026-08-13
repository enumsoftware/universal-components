import { Component, model, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-spinner-loading',
  imports: [],
  templateUrl: './uc-spinner-loading.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-spinner-loading.component.css',
})
export class UcSpinnerLoading {
  color = model<string | undefined>();
  size = model<string | undefined>();
  thickness = model<string | undefined>();
  loading = model.required();
}
