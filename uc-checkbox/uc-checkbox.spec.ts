import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcCheckbox } from './uc-checkbox';

describe('UcCheckbox', () => {
  let component: UcCheckbox;
  let fixture: ComponentFixture<UcCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcCheckbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
