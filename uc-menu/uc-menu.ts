import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';

let nextMenuId = 0;

@Component({
  selector: 'uc-menu',
  exportAs: 'ucMenu',
  templateUrl: './uc-menu.html',
  styleUrl: './uc-menu.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcMenu {
  @ViewChild(TemplateRef, { static: true })
  readonly templateRef!: TemplateRef<unknown>;

  readonly panelId = `uc-menu-panel-${nextMenuId++}`;
}
