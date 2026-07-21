import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcTextarea } from './uc-textarea';

describe('UcTextarea', () => {
  let component: UcTextarea;
  let fixture: ComponentFixture<UcTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcTextarea],
    }).compileComponents();

    fixture = TestBed.createComponent(UcTextarea);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'textarea-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided and hideLabel is false', () => {
    fixture.componentRef.setInput('label', 'Description');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label.uc-textarea-label');
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Description');
  });

  it('should hide label when hideLabel is true', () => {
    fixture.componentRef.setInput('label', 'Description');
    fixture.componentRef.setInput('hideLabel', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label.uc-textarea-label');
    expect(label).toBeFalsy();
  });
});
