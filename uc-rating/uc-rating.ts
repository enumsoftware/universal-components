import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, viewChildren } from '@angular/core';

/**
 * A star rating, 1 to `max`. As an input it is a radio group: click or tap a star, or move with
 * the arrow keys (Home and End jump to the ends); one tab stop, on the chosen star. With `readonly`
 * it only shows a value, which may have a fraction (an average), as partly filled stars.
 */
@Component({
  selector: 'uc-rating',
  templateUrl: './uc-rating.html',
  styleUrl: './uc-rating.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcRating {
  /** The chosen number of stars; null when none is chosen yet. */
  readonly value = model<number | null>(null);
  readonly max = input<number>(5);
  readonly disabled = input<boolean>(false);
  /** Shows the value without letting it change. */
  readonly readonly = input<boolean>(false);
  /** Star size, any CSS length. */
  readonly size = input<string>('1.75rem');
  /** The group's accessible name, such as the question being answered. */
  readonly ariaLabel = input<string | null>(null);
  /** Id(s) of visible text that names the group; used instead of `ariaLabel`. */
  readonly ariaLabelledby = input<string | null>(null);
  /** Each star's accessible name; `{value}` and `{max}` are filled in. */
  readonly starLabel = input<string>('{value} of {max}');

  private readonly starElements = viewChildren<ElementRef<HTMLElement>>('star');

  protected readonly stars = computed(() => Array.from({ length: Math.max(1, Math.floor(this.max())) }, (_, i) => i + 1));

  /** How much of each star is filled, 0 to 100, so a readonly 3.6 shows three and a bit stars. */
  protected fill(star: number): number {
    const value = this.value() ?? 0;
    return Math.round(Math.min(Math.max(value - (star - 1), 0), 1) * 100);
  }

  /** The star that takes the tab stop: the chosen one, or the first while nothing is chosen. */
  protected tabIndex(star: number): number {
    if (this.disabled()) {
      return -1;
    }
    const value = this.value();
    return star === (value && value >= 1 ? Math.round(value) : 1) ? 0 : -1;
  }

  protected label(star: number): string {
    return this.starLabel().replaceAll('{value}', String(star)).replaceAll('{max}', String(this.stars().length));
  }

  protected readonlyLabel(): string {
    const value = this.value();
    return value === null ? '' : this.label(Math.round(value * 10) / 10);
  }

  protected choose(star: number): void {
    if (!this.disabled() && !this.readonly()) {
      this.value.set(star);
    }
  }

  protected onKeydown(event: KeyboardEvent, star: number): void {
    const count = this.stars().length;
    const target =
      event.key === 'ArrowRight' || event.key === 'ArrowUp' ? Math.min(star + 1, count)
      : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? Math.max(star - 1, 1)
      : event.key === 'Home' ? 1
      : event.key === 'End' ? count
      : event.key === ' ' || event.key === 'Enter' ? star
      : null;

    if (target === null) {
      return;
    }

    event.preventDefault();
    this.choose(target);
    this.starElements()[target - 1]?.nativeElement.focus();
  }
}
