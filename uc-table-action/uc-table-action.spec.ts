import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event on click', () => {
    spyOn(component.clicked, 'emit');
    component.onClick();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should display text and icon', () => {
    const fixture = TestBed.createComponent(UcTableAction);
    fixture.componentInstance.text = 'Test' as any;
    fixture.componentInstance.icon = 'arrow-right' as any;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Test');
    expect(button.querySelector('i')).toBeTruthy();
  });
});
