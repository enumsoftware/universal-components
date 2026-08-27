import { Component, effect, input, signal } from '@angular/core';

import { UcTabPanel, UcTabs, type UcTab } from '../uc-tabs';

/** Panels are `ng-template`s tagged with `ucTabPanel`, matched by key. */
@Component({
  selector: 'uc-tabs-preview',
  imports: [UcTabs, UcTabPanel],
  template: `
    <uc-tabs [tabs]="tabs()" [(activeTab)]="current">
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

  protected readonly current = signal('overview');

  constructor() {
    effect(() => this.current.set(this.activeTab()));
  }
}
