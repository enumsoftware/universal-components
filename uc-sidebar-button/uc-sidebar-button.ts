import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'uc-sidebar-button',
  templateUrl: './uc-sidebar-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
