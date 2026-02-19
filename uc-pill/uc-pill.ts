import { Component, model } from '@angular/core';

@Component({
  selector: 'uc-pill',
  imports: [],
  templateUrl: './uc-pill.html',
  styleUrl: './uc-pill.scss',
})
export class UcPill {
  text = model.required<string>();
}
