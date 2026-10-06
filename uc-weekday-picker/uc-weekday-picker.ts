import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import {
  builtInDateLabels,
  injectDateLocaleDefaults,
  localeFirstDayOfWeek,
  localeWeekdayNames,
} from '../uc-calendar/uc-date-locale';

/** One button of the picker. */
export interface UcWeekday {
  /** 1 = Monday ... 7 = Sunday (ISO 8601, as Temporal numbers them). */
  day: number;
  /** Shown on the button, e.g. `Mon` or `Pon`. */
  shortName: string;
  /** Read out by screen readers, e.g. `Monday` or `Ponedjeljak`. */
  name: string;
  selected: boolean;
}

/**
 * Picks the days of the week something applies on, e.g. a timetable that runs Monday to Friday.
 * The value is the ISO day numbers (1 = Monday ... 7 = Sunday), always sorted.
 *
 * ```html
 * <uc-weekday-picker [id]="'days'" [label]="'Days'" [formField]="form.days" />
 * ```
 *
 * Day names and the first day of the week follow `provideUcDateLocale`, then Angular's `LOCALE_ID`,
 * like uc-calendar and uc-date-time-picker.
 */
@Component({
  selector: 'uc-weekday-picker',
  templateUrl: './uc-weekday-picker.html',
  styleUrl: './uc-weekday-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UcWeekdayPicker implements FormValueControl<number[]> {
  /** The chosen days, 1 = Monday ... 7 = Sunday. */
  readonly value = model<number[]>([]);
  /** Prefix for the ids of the label, the buttons and the error messages. */
  readonly id = input<string>('uc-weekday-picker');
  /** Visible name of the group; without it the group is named by the locale's "days of the week" text. */
  readonly label = input<string | undefined>(undefined);
  /** Keeps the label for screen readers only. */
  readonly hideLabel = input<boolean>(false);
  /** BCP 47 locale for the day names. Defaults to provideUcDateLocale, then Angular's LOCALE_ID. */
  readonly locale = input<string | undefined>(undefined);
  /** First button, 1 = Monday ... 7 = Sunday. Defaults to the locale's first day of the week. */
  readonly firstDayOfWeek = input<number | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly invalid = input<boolean>(false);
  readonly touched = model<boolean>(false);

  private readonly localeDefaults = injectDateLocaleDefaults();

  readonly resolvedLocale = computed<string>(() => this.locale() ?? this.localeDefaults.locale);

  private readonly resolvedFirstDayOfWeek = computed<number>(
    () => this.firstDayOfWeek() ?? this.localeDefaults.config.firstDayOfWeek ?? localeFirstDayOfWeek(this.resolvedLocale()),
  );

  /** The name the group is read out with when its label is hidden or missing. */
  readonly groupName = computed<string>(
    () => this.label() || this.localeDefaults.config.labels?.weekdays || builtInDateLabels(this.resolvedLocale()).weekdays,
  );

  readonly showLabel = computed(() => !!this.label() && !this.hideLabel());
  readonly showErrorState = computed(() => this.invalid() && this.touched());

  /** The seven buttons, starting with the locale's first day of the week. */
  readonly weekdays = computed<UcWeekday[]>(() => {
    const locale = this.resolvedLocale();
    const first = this.resolvedFirstDayOfWeek();
    const shortNames = localeWeekdayNames(locale, first, 'short');
    const names = localeWeekdayNames(locale, first, 'long');
    const selected = new Set(this.value());

    return shortNames.map((shortName, i) => {
      const day = ((first - 1 + i) % 7) + 1;
      return { day, shortName, name: names[i], selected: selected.has(day) };
    });
  });

  toggle(day: number): void {
    if (this.disabled()) {
      return;
    }

    const days = new Set(this.value());
    if (days.has(day)) {
      days.delete(day);
    } else {
      days.add(day);
    }
    this.value.set([...days].sort((a, b) => a - b));
  }
}
