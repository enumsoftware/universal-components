import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcSidebar } from './uc-sidebar';

describe('UcSidebar', () => {
  let component: UcSidebar;
  let fixture: ComponentFixture<UcSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
