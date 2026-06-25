import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { UcAccordionItem } from './uc-accordion-item';

describe('UcAccordionItem', () => {
  let component: UcAccordionItem;
  let fixture: ComponentFixture<UcAccordionItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcAccordionItem, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UcAccordionItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle open state', () => {
    expect(component.isOpen()).toBe(false);
    component.toggleOpen();
    expect(component.isOpen()).toBe(true);
  });

  it('should emit itemToggled output on toggle', () => {
    vi.spyOn(component.itemToggled, 'emit');
    component.toggleOpen();
    expect(component.itemToggled.emit).toHaveBeenCalledWith(true);
  });
});
