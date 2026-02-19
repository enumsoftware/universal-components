import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcSlider } from './uc-slider';

describe('UcSlider', () => {
  let component: UcSlider;
  let fixture: ComponentFixture<UcSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
