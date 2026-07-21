import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcButton } from './uc-button';

describe('UcButton', () => {
  let component: UcButton;
  let fixture: ComponentFixture<UcButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Submit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to medium size', () => {
    expect(component.size()).toBe('medium');
  });

  it('should apply small size class', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('uc-size-small')).toBe(true);
  });
});
