import { TestBed } from '@angular/core/testing';
import { UcLinearLoading } from './uc-linear-loading.component';

describe('UcLinearLoading', () => {
  it('should be a status with the default label while loading', () => {
    const fixture = TestBed.createComponent(UcLinearLoading);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
    expect(bar.getAttribute('aria-label')).toBe('Loading');
  });

  it('should announce the given label', () => {
    const fixture = TestBed.createComponent(UcLinearLoading);
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('label', 'Učitavanje');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]').getAttribute('aria-label')).toBe('Učitavanje');
  });

  it('should render nothing when not loading', () => {
    const fixture = TestBed.createComponent(UcLinearLoading);
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.linear-loader')).toBeNull();
  });
});
