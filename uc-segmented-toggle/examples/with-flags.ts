import { Component, signal } from '@angular/core';

import { UcFlag } from '../../uc-flag/uc-flag';
import { UcSegmentedToggleItem } from '../uc-segmented-toggle-item';
import { UcSegmentedToggle } from '../uc-segmented-toggle';

/** Any element marked `ucSegmentedTogglePrefix` takes the icon's place before the text. */
@Component({
  selector: 'uc-segmented-toggle-with-flags-example',
  imports: [UcFlag, UcSegmentedToggle, UcSegmentedToggleItem],
  template: `
    <uc-segmented-toggle [(value)]="language" variant="pills" ariaLabel="Language">
      <uc-segmented-toggle-item value="hr">
        <uc-flag ucSegmentedTogglePrefix countryCode="hr" size="1.125rem" [circular]="true" />
        Hrvatski
      </uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="en">
        <uc-flag ucSegmentedTogglePrefix countryCode="gb" size="1.125rem" [circular]="true" />
        English
      </uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="de">
        <uc-flag ucSegmentedTogglePrefix countryCode="de" size="1.125rem" [circular]="true" />
        Deutsch
      </uc-segmented-toggle-item>
    </uc-segmented-toggle>
  `,
})
export class WithFlagsExample {
  protected readonly language = signal('hr');
}
