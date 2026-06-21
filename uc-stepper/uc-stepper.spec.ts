import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UcStepper } from './uc-stepper';
import { UcStep } from './uc-step';

@Component({
  template: `
    <uc-stepper>
      <uc-step [label]="'Step 1'">
        <p>Content 1</p>
      </uc-step>
      <uc-step [label]="'Step 2'">
        <p>Content 2</p>
      </uc-step>
      <uc-step [label]="'Step 3'" [optional]="true">
        <p>Content 3</p>
      </uc-step>
    </uc-stepper>
  `,
  imports: [UcStepper, UcStep],
})
class TestHostComponent {}

describe('UcStepper', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    nativeElement = fixture.nativeElement;
  });

  it('should render the step headers', () => {
    const headers = nativeElement.querySelectorAll('.uc-stepper__step-header');
    expect(headers.length).toBe(3);
  });

  it('should mark the first step as active by default', () => {
    const headers = nativeElement.querySelectorAll('.uc-stepper__step-header');
    expect(headers[0].classList).toContain('uc-stepper__step-header--active');
    expect(headers[1].classList).not.toContain('uc-stepper__step-header--active');
  });

  it('should render connector lines between steps', () => {
    const connectors = nativeElement.querySelectorAll('.uc-stepper__connector');
    expect(connectors.length).toBe(2);
  });

  it('should show step labels', () => {
    const labels = nativeElement.querySelectorAll('.uc-stepper__step-label-text');
    expect(labels[0].textContent?.trim()).toBe('Step 1');
    expect(labels[1].textContent?.trim()).toBe('Step 2');
    expect(labels[2].textContent?.trim()).toBe('Step 3');
  });

  it('should show optional label on optional steps', () => {
    const optionalLabels = nativeElement.querySelectorAll('.uc-stepper__step-optional');
    expect(optionalLabels.length).toBe(1);
  });

  it('should navigate to a step on header click', () => {
    const headers = nativeElement.querySelectorAll<HTMLButtonElement>('.uc-stepper__step-header');
    headers[1].click();
    fixture.detectChanges();

    expect(headers[1].classList).toContain('uc-stepper__step-header--active');
    expect(headers[0].classList).not.toContain('uc-stepper__step-header--active');
  });
});
