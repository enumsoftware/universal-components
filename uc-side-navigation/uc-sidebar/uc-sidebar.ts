import { Component, model } from '@angular/core';

@Component({
  selector: 'uc-sidebar',
  imports: [],
  templateUrl: './uc-sidebar.html',
  styleUrl: './uc-sidebar.scss',
})
export class UcSidebar {
  opened = model(true);
}
