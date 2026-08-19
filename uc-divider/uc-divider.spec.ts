import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcDivider } from './uc-divider';

describe('UcDivider', () => {
  let component: UcDivider;
  let fixture: ComponentFixture<UcDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcDivider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcDivider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applies the inverse class for the inverse variant', () => {
    fixture.componentRef.setInput('variant', 'inverse');
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('uc-divider--inverse')).toBe(true);
  });
});
