import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';

export const SIDEBAR_BUTTON_STYLE_OPTIONS = ['primary', 'secondary'] as const;
export type SidebarButtonStyle = (typeof SIDEBAR_BUTTON_STYLE_OPTIONS)[number];

@Component({
  selector: 'uc-sidebar-button',
  templateUrl: './uc-sidebar-button.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-sidebar-button.css',
})
export class UcSidebarButton {
  text = model.required<string>();
  active = model.required<boolean>();
  style = input<SidebarButtonStyle>('primary');
  clicked = output<void>();

  onClick(event: MouseEvent) {
    event.preventDefault();
    this.clicked.emit();
  }
}
