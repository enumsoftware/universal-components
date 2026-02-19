import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcPill } from './uc-pill';

describe('UcPill', () => {
  let component: UcPill;
  let fixture: ComponentFixture<UcPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcPill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcPill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
