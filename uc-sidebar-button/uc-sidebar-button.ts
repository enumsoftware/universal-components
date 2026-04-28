import { NgClass } from '@angular/common';
import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'uc-sidebar-button',
  imports: [NgClass],
  templateUrl: './uc-sidebar-button.html',
  styleUrl: './uc-sidebar-button.css',
})
export class UcSidebarButton {
  text = model.required<string>();
  active = model.required<boolean>();
  style = input<'primary' | 'secondary'>('primary');
  phosphorIcon = input<string | undefined>(undefined);
  clicked = output<void>();

  onClick(event: MouseEvent) {
    event.preventDefault();
    this.clicked.emit();
  }
}
