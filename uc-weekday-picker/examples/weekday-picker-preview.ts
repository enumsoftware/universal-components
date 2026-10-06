import { Component, effect, input, signal } from '@angular/core';

import { UcWeekdayPicker } from '../uc-weekday-picker';

/** `value` is a model, so the picker reports the chosen days back to the caller. */
@Component({
  selector: 'uc-weekday-picker-preview',
  imports: [UcWeekdayPicker],
  styles: `
    p {
      margin-top: 1rem;
      color: var(--uc-paragraph-text-color);
    }
  `,
  template: `
    <uc-weekday-picker
      [id]="'preview-days'"
      [label]="label()"
      [locale]="locale() || undefined"
      [disabled]="disabled()"
      [(value)]="days"
    />
    <p>Selected days (1 = Monday): {{ days().join(', ') || 'none' }}</p>
  `,
})
export class WeekdayPickerPreview {
  readonly label = input<string>('Runs on');
  readonly locale = input<string>('');
  readonly disabled = input<boolean>(false);

  protected readonly days = signal<number[]>([1, 2, 3, 4, 5]);

  constructor() {
    effect(() => {
      if (this.disabled()) {
        this.days.set([6, 7]);
      }
    });
  }
}
