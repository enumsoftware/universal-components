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
});
