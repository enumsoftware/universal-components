import { TestBed } from '@angular/core/testing';
import { UcSpinnerLoading } from './uc-spinner-loading.component';

describe('UcSpinnerLoading', () => {
  it('should announce "Loading" by default', () => {
    const fixture = TestBed.createComponent(UcSpinnerLoading);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
    expect(spinner.getAttribute('aria-label')).toBe('Loading');
  });

  it('should announce the given label', () => {
    const fixture = TestBed.createComponent(UcSpinnerLoading);
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('label', 'Učitavanje');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]').getAttribute('aria-label')).toBe('Učitavanje');
  });

  it('should render nothing when not loading', () => {
    const fixture = TestBed.createComponent(UcSpinnerLoading);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });
});
