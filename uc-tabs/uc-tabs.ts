import {
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChildren,
  inject,
  input,
  model,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export const TABS_VARIANT_OPTIONS = ['underline', 'pills'] as const;
export type UcTabsVariant = (typeof TABS_VARIANT_OPTIONS)[number];

export interface UcTab {
  key: string;
  label: string;
  /** A disabled tab stays visible but can't be selected. It doesn't change an `activeTab` the host has already set. */
  disabled?: boolean;
  /**
   * Defaults to `true`. `false` hides the tab and its panel completely, unlike `disabled`, which
   * leaves the tab showing. A hidden tab can't be selected. If it is already active, no panel is shown.
   */
  visible?: boolean;
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
  /** `underline` marks the active tab with a bar beneath it; `pills` fills it with a rounded background. */
  readonly variant = input<UcTabsVariant>('underline');
  readonly panels = contentChildren(UcTabPanel);

  readonly visibleTabs = computed(() => this.tabs().filter((tab) => tab.visible !== false));

  readonly isActiveTabHidden = computed(() =>
    this.tabs().some((tab) => tab.key === this.activeTab() && tab.visible === false),
  );

  selectTab(key: string) {
    const tab = this.tabs().find((candidate) => candidate.key === key);
    if (tab?.disabled || tab?.visible === false) {
      return;
    }
    this.activeTab.set(key);
  }
}
