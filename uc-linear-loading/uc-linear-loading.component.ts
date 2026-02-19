import { Component, model } from '@angular/core';

@Component({
  selector: 'uc-linear-loading',
  imports: [],
  templateUrl: './uc-linear-loading.component.html',
  styleUrl: './uc-linear-loading.component.css',
})
export class LinearLoadingComponent {
  color = model<string>('#7eb1a7');
  loading = model.required();
}
