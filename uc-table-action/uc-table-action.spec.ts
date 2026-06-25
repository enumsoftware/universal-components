import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { UcTableAction } from './uc-table-action';

describe('UcTableAction', () => {
  let component: UcTableAction;
  let fixture: ComponentFixture<UcTableAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcTableAction],
    }).compileComponents();

    fixture = TestBed.createComponent(UcTableAction);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Action');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event on click', () => {
    vi.spyOn(component.clicked, 'emit');
    component.onClick();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should display text and icon', () => {
    const fixture = TestBed.createComponent(UcTableAction);
    fixture.componentRef.setInput('text', 'Test');
    fixture.componentRef.setInput('icon', 'arrow-right');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Test');
    expect(button.querySelector('i')).toBeTruthy();
  });
});
