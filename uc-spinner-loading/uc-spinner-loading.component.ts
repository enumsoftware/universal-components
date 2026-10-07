import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';

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
  /** What screen readers announce while it spins; replace it in apps in other languages. */
  label = input<string>('Loading');
}
