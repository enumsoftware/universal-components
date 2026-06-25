import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
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
    vi.spyOn(component.pageChange, 'emit');
    component.goToPage(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });
});
