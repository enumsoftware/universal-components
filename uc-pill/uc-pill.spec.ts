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
    fixture.componentRef.setInput('text', 'Badge');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply valid variant class', () => {
    fixture.componentRef.setInput('variant', 'valid');
    fixture.detectChanges();

    const pill = fixture.nativeElement.querySelector('.uc-pill');
    expect(pill.classList.contains('uc-pill--valid')).toBe(true);
  });

  it('should apply error variant class', () => {
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();

    const pill = fixture.nativeElement.querySelector('.uc-pill');
    expect(pill.classList.contains('uc-pill--error')).toBe(true);
  });

  it('should apply compact size class', () => {
    fixture.componentRef.setInput('size', 'compact');
    fixture.detectChanges();

    const pill = fixture.nativeElement.querySelector('.uc-pill');
    expect(pill.classList.contains('uc-pill--compact')).toBe(true);
  });
});
