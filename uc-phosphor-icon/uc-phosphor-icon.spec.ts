import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcPhosphorIcon } from './uc-phosphor-icon';

describe('UcPhosphorIcon', () => {
  let component: UcPhosphorIcon;
  let fixture: ComponentFixture<UcPhosphorIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcPhosphorIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(UcPhosphorIcon);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'house');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render icon class', () => {
    const icon = fixture.nativeElement.querySelector('.uc-phosphor-icon');
    expect(icon.classList.contains('ph-house')).toBe(true);
  });

  it('should apply weight class', () => {
    fixture.componentRef.setInput('weight', 'bold');
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.uc-phosphor-icon');
    expect(icon.classList.contains('ph-bold')).toBe(true);
  });
});
