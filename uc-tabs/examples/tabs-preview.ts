import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';

import { UcTabPanel, UcTabs, type UcTab, type UcTabsVariant } from '../uc-tabs';

/**
 * Panels are `ng-template`s tagged with `ucTabPanel`, matched by key. Closing a tab removes it
 * until the `tabs` knob changes, and moves to its neighbour when it was active.
 */
@Component({
  selector: 'uc-tabs-preview',
  imports: [UcTabs, UcTabPanel],
  template: `
    <uc-tabs
      [tabs]="openTabs()"
      [(activeTab)]="current"
      [variant]="variant()"
      (tabClose)="close($event)"
    >
      <ng-template ucTabPanel="overview">
        <p>Overview content goes here.</p>
      </ng-template>
      <ng-template ucTabPanel="details">
        <p>Details content goes here.</p>
      </ng-template>
      <ng-template ucTabPanel="settings">
        <p>Settings content goes here.</p>
      </ng-template>
    </uc-tabs>
  `,
})
export class TabsPreview {
  readonly tabs = input<UcTab[]>([
    { key: 'overview', label: 'Overview' },
    { key: 'details', label: 'Details' },
    { key: 'settings', label: 'Settings' },
  ]);
  readonly activeTab = input<string>('overview');
  readonly variant = input<UcTabsVariant>('underline');
  readonly tabClose = output<string>();

  protected readonly openTabs = linkedSignal(() => this.tabs());
  protected readonly current = signal('overview');

  constructor() {
    effect(() => this.current.set(this.activeTab()));
  }

  protected close(key: string) {
    const tabs = this.openTabs();
    const index = tabs.findIndex((tab) => tab.key === key);
    const remaining = tabs.filter((tab) => tab.key !== key);
    if (this.current() === key && remaining.length) {
      this.current.set(remaining[Math.min(index, remaining.length - 1)].key);
    }
    this.openTabs.set(remaining);
    this.tabClose.emit(key);
  }
}
