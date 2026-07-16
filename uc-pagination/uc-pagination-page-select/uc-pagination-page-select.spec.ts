import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { UcPaginationPageSelect } from './uc-pagination-page-select';

describe('UcPaginationPageSelect', () => {
  let component: UcPaginationPageSelect;
  let fixture: ComponentFixture<UcPaginationPageSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcPaginationPageSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(UcPaginationPageSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedSize', 10);
    fixture.componentRef.setInput('sizes', [10, 25, 50]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected page size', () => {
    vi.spyOn(component.sizeSelected, 'emit');

    component.selectSize(25);

    expect(component.sizeSelected.emit).toHaveBeenCalledWith(25);
  });

  it('should toggle dropdown open state', () => {
    expect(component.isOpen()).toBe(false);

    component.toggleDropdown();
    expect(component.isOpen()).toBe(true);

    component.toggleDropdown();
    expect(component.isOpen()).toBe(false);
  });

  it('should close dropdown after selecting page size', () => {
    vi.spyOn(component.sizeSelected, 'emit');
    component.isOpen.set(true);

    component.selectSize(50);

    expect(component.sizeSelected.emit).toHaveBeenCalledWith(50);
    expect(component.isOpen()).toBe(false);
  });

  it('should ignore invalid page size selection', () => {
    vi.spyOn(component.sizeSelected, 'emit');

    component.selectSize(0);

    expect(component.sizeSelected.emit).not.toHaveBeenCalled();
  });

  it('should include selected size when it is missing from provided sizes', () => {
    fixture.componentRef.setInput('selectedSize', 20);
    fixture.componentRef.setInput('sizes', [10, 25, 50]);
    fixture.detectChanges();

    expect(component.availableSizes()).toEqual([20, 10, 25, 50]);
  });

  it('should close dropdown on Escape key', () => {
    component.isOpen.set(true);

    component.onTriggerKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.isOpen()).toBe(false);
  });
});
