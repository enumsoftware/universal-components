import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcColorPicker } from './uc-color-picker';

describe('UcColorPicker', () => {
  let component: UcColorPicker;
  let fixture: ComponentFixture<UcColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcColorPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(UcColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
