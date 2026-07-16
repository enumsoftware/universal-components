/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcPagination } from './uc-pagination';

describe('UcPagination', () => {
  let component: UcPagination;
  let fixture: ComponentFixture<UcPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcPagination],
    }).compileComponents();

    fixture = TestBed.createComponent(UcPagination);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentPage', 0);
    fixture.componentRef.setInput('totalItems', 100);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    expect(component.totalPages()).toBe(10);
  });

  it('should disable previous on first page', () => {
    expect(component.isPreviousDisabled()).toBe(true);
  });

  it('should enable next when not on last page', () => {
    expect(component.isNextDisabled()).toBe(false);
  });

  it('should emit page change event', () => {
    spyOn(component.pageChange, 'emit');
    component.goToPage(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should resolve page info template placeholders', () => {
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('pageInfoTemplate', 'Currently on {currentPage} / {totalPages}');
    fixture.detectChanges();

    expect(component.pageInfoText()).toBe('Currently on 3 / 10');
  });

  it('should show max 3 visible pages around current page', () => {
    fixture.componentRef.setInput('currentPage', 4);
    fixture.detectChanges();

    expect(component.visiblePages()).toEqual([3, 4, 5]);
  });

  it('should fast jump forward by 3 pages', () => {
    spyOn(component.pageChange, 'emit');
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    component.fastNextPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(5);
  });

  it('should fast jump backward by 3 pages', () => {
    spyOn(component.pageChange, 'emit');
    fixture.componentRef.setInput('currentPage', 5);
    fixture.detectChanges();

    component.fastPreviousPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should show last page shortcut when visible pages do not include last page', () => {
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    expect(component.showLastPageShortcut()).toBe(true);
    expect(component.lastPageIndex()).toBe(9);
  });

  it('should hide last page shortcut when visible pages already include last page', () => {
    fixture.componentRef.setInput('currentPage', 9);
    fixture.detectChanges();

    expect(component.showLastPageShortcut()).toBe(false);
  });

  it('should accept selected page from page-select component', () => {
    spyOn(component.pageChange, 'emit');

    component.goToPage(5);

    expect(component.pageChange.emit).toHaveBeenCalledWith(5);
  });

  it('should keep page size selector visible when page size exceeds total items', () => {
    fixture.componentRef.setInput('totalItems', 5);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('showPageSelector', true);
    fixture.detectChanges();

    const selector = fixture.nativeElement.querySelector('uc-pagination-page-select');

    expect(selector).not.toBeNull();
  });

  it('should show pagination controls with a single page when page size exceeds total items', () => {
    fixture.componentRef.setInput('totalItems', 5);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    const pageButtons = fixture.nativeElement.querySelectorAll('.uc-pagination__page-btn');
    const previousButton = fixture.nativeElement.querySelector(
      '.uc-pagination__btn .uc-pagination-page-button[aria-label="Previous page"]'
    ) as HTMLButtonElement;
    const nextButton = fixture.nativeElement.querySelector(
      '.uc-pagination__btn .uc-pagination-page-button[aria-label="Next page"]'
    ) as HTMLButtonElement;

    expect(pageButtons.length).toBe(1);
    expect(previousButton).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(previousButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(true);
  });

  it('should emit page size change when selecting a different size', () => {
    spyOn(component.pageSizeChange, 'emit');

    component.onPageSizeSelect(25);

    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(25);
  });

  it('should ignore page size selection when same as current page size', () => {
    spyOn(component.pageSizeChange, 'emit');

    component.onPageSizeSelect(10);

    expect(component.pageSizeChange.emit).not.toHaveBeenCalled();
  });
});
