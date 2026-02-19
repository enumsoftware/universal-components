import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcFlag } from './uc-flag';

describe('UcFlag', () => {
  let component: UcFlag;
  let fixture: ComponentFixture<UcFlag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcFlag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcFlag);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('countryCode', 'gr');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
