import { Component, signal } from '@angular/core';

import { UcTabPanel, UcTabs, type UcTab } from '../uc-tabs';

const INITIAL_TABS: UcTab[] = [
  { key: 'home', label: 'Home' },
  { key: 'invoice-1042', label: 'Invoice #1042', closable: true },
  { key: 'invoice-1043', label: 'Invoice #1043', closable: true },
  { key: 'invoice-1044', label: 'Invoice #1044', closable: true },
];

/**
 * `tabClose` only reports the request; the host removes the tab and, when it was active, moves
 * to a neighbour. Here that is the tab after it, or the one before when it was last.
 */
@Component({
  selector: 'uc-tabs-closable-example',
  imports: [UcTabs, UcTabPanel],
  template: `
    <uc-tabs [tabs]="tabs()" [(activeTab)]="current" (tabClose)="close($event)">
      @for (tab of tabs(); track tab.key) {
        <ng-template [ucTabPanel]="tab.key">
          <p>{{ tab.label }} content goes here.</p>
        </ng-template>
      }
    </uc-tabs>
  `,
})
export class ClosableTabsExample {
  protected readonly tabs = signal<UcTab[]>(INITIAL_TABS);
  protected readonly current = signal('invoice-1042');

  protected close(key: string) {
    const tabs = this.tabs();
    const index = tabs.findIndex((tab) => tab.key === key);
    const remaining = tabs.filter((tab) => tab.key !== key);
    if (this.current() === key && remaining.length) {
      this.current.set(remaining[Math.min(index, remaining.length - 1)].key);
    }
    this.tabs.set(remaining);
  }
}
