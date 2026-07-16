import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'uc-pagination-page-select',
  imports: [OverlayModule],
  templateUrl: './uc-pagination-page-select.html',
  styleUrl: './uc-pagination-page-select.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class: 'uc-pagination-page-select-host',
  },
})
export class UcPaginationPageSelect {
  private static nextId = 0;

  readonly selectId = `uc-pagination-page-select-${UcPaginationPageSelect.nextId++}`;

  selectedSize = input.required<number>();
  sizes = input<number[]>([10, 25, 50, 100]);

  sizeSelected = output<number>();

  isOpen = signal<boolean>(false);

  availableSizes = computed(() => {
    const normalized = this.sizes()
      .map((size) => Number(size))
      .filter((size) => Number.isInteger(size) && size > 0);

    const uniqueSizes = Array.from(new Set(normalized));
    const selected = this.selectedSize();

    if (Number.isInteger(selected) && selected > 0 && !uniqueSizes.includes(selected)) {
      return [selected, ...uniqueSizes];
    }

    return uniqueSizes;
  });

  toggleDropdown(): void {
    this.isOpen.update((state) => !state);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  selectSize(size: number): void {
    if (size > 0) {
      this.sizeSelected.emit(size);
      this.closeDropdown();
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown();
      return;
    }

    if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.closeDropdown();
    }
  }
}
