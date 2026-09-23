import { Component, signal } from '@angular/core';

import { UcButton } from '../uc-button';
import { BUTTON_EXAMPLE_ROW_STYLES } from './example-layout';

/** Toggles side by side, so the off and on states are compared rather than described. */
@Component({
  selector: 'uc-button-toggle-example',
  imports: [UcButton],
  styles: BUTTON_EXAMPLE_ROW_STYLES,
  template: `
    <uc-button text="Notifications" isToggleEnabled [(pressed)]="notifications" />
    <uc-button text="Bold" isToggleEnabled [(pressed)]="bold" />
    <uc-button text="Mute alarms" isToggleEnabled [(pressed)]="muted" />
  `,
})
export class ToggleExample {
  readonly notifications = signal(true);
  readonly bold = signal(false);
  readonly muted = signal(false);
}
