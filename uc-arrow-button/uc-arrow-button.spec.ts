import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcArrowButton } from './uc-arrow-button';

describe('UcArrowButton', () => {
  let component: UcArrowButton;
  let fixture: ComponentFixture<UcArrowButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcArrowButton],
    }).compileComponents();

    fixture = TestBed.createComponent(UcArrowButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Action');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
