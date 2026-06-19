import { Component, model, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-sidebar',
  imports: [],
  templateUrl: './uc-sidebar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-sidebar.css',
})
export class UcSidebar {
  opened = model(true);
}
