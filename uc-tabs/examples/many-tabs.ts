import { Component, signal } from '@angular/core';

import { UcTabPanel, UcTabs, type UcTab } from '../uc-tabs';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * More tabs than fit: arrows scroll the strip on desktop, and under 768px the tabs collapse into a
 * dropdown. Resize the canvas to see both.
 */
@Component({
  selector: 'uc-tabs-many-tabs-example',
  imports: [UcTabs, UcTabPanel],
  template: `
    <uc-tabs [tabs]="tabs" [(activeTab)]="current" label="Month">
      @for (tab of tabs; track tab.key) {
        <ng-template [ucTabPanel]="tab.key">
          <p>{{ tab.label }} report goes here.</p>
        </ng-template>
      }
    </uc-tabs>
  `,
})
export class ManyTabsExample {
  readonly tabs: UcTab[] = MONTHS.map((month) => ({
    key: month.toLowerCase(),
    label: `${month} report`,
    disabled: month === 'April',
  }));

  protected readonly current = signal('january');
}
