import { Component, computed, input, output } from '@angular/core';
import { UcIconButton } from '../uc-icon-button/uc-icon-button';
import { UcButton } from '../uc-button/uc-button';

@Component({
  selector: 'uc-pagination',
  templateUrl: './uc-pagination.html',
  styleUrl: './uc-pagination.scss',
  imports: [UcButton, UcIconButton],
})
export class UcPagination {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  showPageInfo = input<boolean>(true);

  pageChange = output<number>();

  totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize())
  );

  isPreviousDisabled = computed(() => this.currentPage() === 0);

  isNextDisabled = computed(() => this.currentPage() >= this.totalPages() - 1);

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  nextPage(): void {
    if (!this.isNextDisabled()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (!this.isPreviousDisabled()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  createRange(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }
}
