import {
  Component,
  Directive,
  TemplateRef,
  contentChildren,
  inject,
  input,
  model,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface UcTab {
  key: string;
  label: string;
}

@Directive({
  selector: '[ucTabPanel]',
})
export class UcTabPanel {
  readonly key = input.required<string>({ alias: 'ucTabPanel' });
  readonly templateRef = inject(TemplateRef);
}

@Component({
  selector: 'uc-tabs',
  imports: [NgTemplateOutlet],
  templateUrl: './uc-tabs.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './uc-tabs.css',
})
export class UcTabs {
  readonly tabs = input.required<UcTab[]>();
  readonly activeTab = model.required<string>();
  readonly panels = contentChildren(UcTabPanel);

  selectTab(key: string) {
    this.activeTab.set(key);
  }
}
