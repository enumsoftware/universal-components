import { Component, ChangeDetectionStrategy } from '@angular/core';

let tooltipIdCounter = 0;

@Component({
  selector: 'app-uc-tooltip-component',
  imports: [],
  templateUrl: './uc-tooltip-component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-tooltip-component.css',
})
export class UcTooltipComponent {
  text = '';
  id = `uc-tooltip-${++tooltipIdCounter}`;
}
