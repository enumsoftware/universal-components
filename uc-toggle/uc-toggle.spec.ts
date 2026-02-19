import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcToggle } from './uc-toggle';

describe('UcToggle', () => {
  let component: UcToggle;
  let fixture: ComponentFixture<UcToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
