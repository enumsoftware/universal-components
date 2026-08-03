import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcPill } from './uc-pill';

@Component({
  imports: [UcPill],
  template: `<uc-pill text="Badge" (clicked)="clicks = clicks + 1"></uc-pill>`,
})
class ClickableHost {
  clicks = 0;
}

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

  it('should not apply clickable class without a clicked listener', () => {
    const pill = fixture.nativeElement.querySelector('.uc-pill');
    expect(pill.classList.contains('uc-pill--clickable')).toBe(false);
  });

  it('should apply compact size class', () => {
    fixture.componentRef.setInput('size', 'compact');
    fixture.detectChanges();

    const pill = fixture.nativeElement.querySelector('.uc-pill');
    expect(pill.classList.contains('uc-pill--compact')).toBe(true);
  });

  it('should apply clickable class when a clicked listener is bound', async () => {
    const hostFixture = TestBed.createComponent(ClickableHost);
    hostFixture.detectChanges();

    const pill = hostFixture.nativeElement.querySelector('.uc-pill');
    expect(pill.classList.contains('uc-pill--clickable')).toBe(true);

    pill.click();
    hostFixture.detectChanges();
    expect(hostFixture.componentInstance.clicks).toBe(1);
  });
});
