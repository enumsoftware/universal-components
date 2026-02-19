import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcTooltipComponent } from './uc-tooltip-component';

describe('UcTooltipComponent', () => {
  let component: UcTooltipComponent;
  let fixture: ComponentFixture<UcTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcTooltipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
