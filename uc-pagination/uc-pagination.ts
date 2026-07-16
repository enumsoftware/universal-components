import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { UcPaginationPageButton } from './uc-pagination-page-button/uc-pagination-page-button';
import { UcPaginationPageSelect } from './uc-pagination-page-select/uc-pagination-page-select';

@Component({
  selector: 'uc-pagination',
  templateUrl: './uc-pagination.html',
  styleUrl: './uc-pagination.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [UcPaginationPageButton, UcPaginationPageSelect],
})
export class UcPagination {
  private readonly pageWindowSize = 3;
  private readonly defaultPageSizes = [10, 25, 50, 100];

  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  pageSizeOptions = input<number[]>(this.defaultPageSizes);
  showPageInfo = input<boolean>(true);
  showPageSelector = input<boolean>(true);
  pageInfoTemplate = input<string>('Page {currentPage} of {totalPages}');

  pageChange = output<number>();
  pageSizeChange = output<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  pageInfoText = computed(() => {
    const currentPageText = (this.currentPage() + 1).toString();
    const totalPagesText = this.totalPages().toString();

    return this.pageInfoTemplate()
      .replaceAll('{currentPage}', currentPageText)
      .replaceAll('{totalPages}', totalPagesText);
  });

  isPreviousDisabled = computed(() => this.currentPage() === 0);

  isNextDisabled = computed(() => this.currentPage() >= this.totalPages() - 1);

  visiblePages = computed(() => {
    const total = this.totalPages();
    const windowSize = this.pageWindowSize;

    if (total === 0) {
      return [];
    }

    let start = Math.max(0, this.currentPage() - Math.floor(windowSize / 2));
    let end = start + windowSize;

    if (end > total) {
      end = total;
      start = Math.max(0, end - windowSize);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  });

  lastPageIndex = computed(() => Math.max(this.totalPages() - 1, 0));

  showLastPageShortcut = computed(() => {
    const visible = this.visiblePages();
    if (visible.length === 0 || this.totalPages() <= this.pageWindowSize) {
      return false;
    }

    return visible[visible.length - 1] < this.lastPageIndex();
  });

  isFastPreviousDisabled = computed(() => this.currentPage() === 0);

  isFastNextDisabled = computed(() => this.currentPage() >= this.totalPages() - 1);

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

  fastPreviousPage(): void {
    if (!this.isFastPreviousDisabled()) {
      this.pageChange.emit(Math.max(this.currentPage() - this.pageWindowSize, 0));
    }
  }

  fastNextPage(): void {
    if (!this.isFastNextDisabled()) {
      this.pageChange.emit(
        Math.min(this.currentPage() + this.pageWindowSize, this.totalPages() - 1)
      );
    }
  }

  onPageSizeSelect(size: number): void {
    if (size > 0 && size !== this.pageSize()) {
      this.pageSizeChange.emit(size);
    }
  }

}
