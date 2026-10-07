import { Component, effect, input, signal } from '@angular/core';

import { PaginationSize, UcPagination } from '../uc-pagination';

/**
 * The component is controlled: it reports page changes and expects the caller
 * to feed the new page back in. The showcase drives this preview so the
 * playground behaves like a real consumer rather than a dead control.
 */
@Component({
  selector: 'uc-pagination-preview',
  imports: [UcPagination],
  template: `
    <uc-pagination
      [currentPage]="page()"
      [totalItems]="totalItems()"
      [pageSize]="currentPageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [showPageInfo]="showPageInfo()"
      [showPageSelector]="showPageSelector()"
      [pageInfoTemplate]="pageInfoTemplate()"
      [size]="size()"
      [hideSinglePage]="hideSinglePage()"
      (pageChange)="page.set($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    />
  `,
})
export class PaginationPreview {
  readonly currentPage = input<number>(0);
  readonly totalItems = input<number>(100);
  readonly pageSize = input<number>(10);
  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  readonly showPageInfo = input<boolean>(true);
  readonly showPageSelector = input<boolean>(true);
  readonly pageInfoTemplate = input<string>('Page {currentPage} of {totalPages}');
  readonly size = input<PaginationSize>('medium');
  readonly hideSinglePage = input<boolean>(true);

  protected readonly page = signal(0);
  protected readonly currentPageSize = signal(10);

  constructor() {
    // The knobs seed the state; interaction takes over from there.
    effect(() => this.page.set(this.currentPage()));
    effect(() => this.currentPageSize.set(this.pageSize()));
  }

  protected onPageSizeChange(size: number): void {
    this.currentPageSize.set(size);
    this.page.set(0);
  }
}
