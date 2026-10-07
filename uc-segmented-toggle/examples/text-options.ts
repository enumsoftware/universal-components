import { Component, signal } from '@angular/core';

import { UcSegmentedToggleItem } from '../uc-segmented-toggle-item';
import { UcSegmentedToggle } from '../uc-segmented-toggle';

/** The default track with plain text options, like the Map / Satellite switch on uc-map. */
@Component({
  selector: 'uc-segmented-toggle-text-only-example',
  imports: [UcSegmentedToggle, UcSegmentedToggleItem],
  template: `
    <uc-segmented-toggle [(value)]="range" ariaLabel="Date range">
      <uc-segmented-toggle-item value="day">Day</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="week">Week</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="month">Month</uc-segmented-toggle-item>
    </uc-segmented-toggle>
  `,
})
export class TextOnlyExample {
  protected readonly range = signal('week');
}

/**
 * Sized down with the component tokens, as the editor toolbar does. The options' corners follow the
 * smaller track radius and padding on their own.
 */
@Component({
  selector: 'uc-segmented-toggle-compact-example',
  imports: [UcSegmentedToggle, UcSegmentedToggleItem],
  styles: `
    :host {
      --uc-segmented-toggle-border-radius: 0.5rem;
      --uc-segmented-toggle-padding: 0.1875rem;
      --uc-segmented-toggle-item-font-size: 0.8rem;
      --uc-segmented-toggle-item-padding-block: 0.25rem;
      --uc-segmented-toggle-item-padding-inline: 0.6rem;
    }
  `,
  template: `
    <uc-segmented-toggle [(value)]="view" ariaLabel="Editor view">
      <uc-segmented-toggle-item value="edit" icon="pencil-simple">Edit</uc-segmented-toggle-item>
      <uc-segmented-toggle-item value="preview" icon="eye">Preview</uc-segmented-toggle-item>
    </uc-segmented-toggle>
  `,
})
export class CompactExample {
  protected readonly view = signal('edit');
}
