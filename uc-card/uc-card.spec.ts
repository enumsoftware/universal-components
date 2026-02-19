import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcCard } from './uc-card';

describe('UcCard', () => {
  let component: UcCard;
  let fixture: ComponentFixture<UcCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
