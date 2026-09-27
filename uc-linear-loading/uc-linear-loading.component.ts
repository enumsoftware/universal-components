import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-linear-loading',
  imports: [],
  templateUrl: './uc-linear-loading.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-linear-loading.component.css',
})
export class UcLinearLoading {
  color = model<string | undefined>();
  loading = model.required();
  /** What screen readers announce while it runs; replace it in apps in other languages. */
  label = input<string>('Loading');
}
