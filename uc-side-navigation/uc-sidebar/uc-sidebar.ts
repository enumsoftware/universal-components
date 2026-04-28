import { Component, model } from '@angular/core';

@Component({
  selector: 'uc-sidebar',
  imports: [],
  templateUrl: './uc-sidebar.html',
  styleUrl: './uc-sidebar.css',
})
export class UcSidebar {
  opened = model(true);
}
