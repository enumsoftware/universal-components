import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcIconButton } from './uc-icon-button';

describe('UcImageButton', () => {
  let component: UcIconButton;
  let fixture: ComponentFixture<UcIconButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcIconButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcIconButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
