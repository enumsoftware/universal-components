import { Component } from '@angular/core';

let tooltipIdCounter = 0;

@Component({
  selector: 'app-uc-tooltip-component',
  imports: [],
  templateUrl: './uc-tooltip-component.html',
  styleUrl: './uc-tooltip-component.css',
})
export class UcTooltipComponent {
  text = '';
  id = `uc-tooltip-${++tooltipIdCounter}`;
}
