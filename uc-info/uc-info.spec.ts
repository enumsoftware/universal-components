import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcInfo } from './uc-info';

describe('UcInfo', () => {
  let component: UcInfo;
  let fixture: ComponentFixture<UcInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(UcInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default variant as info', () => {
    expect(component.variant()).toBe('info');
  });
});
