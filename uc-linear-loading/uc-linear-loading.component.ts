import { Component, model } from '@angular/core';

@Component({
  selector: 'uc-linear-loading',
  imports: [],
  templateUrl: './uc-linear-loading.component.html',
  styleUrl: './uc-linear-loading.component.css',
})
export class UcLinearLoading {
  color = model<string | undefined>();
  loading = model.required();
}
