import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcAnchor } from './uc-anchor';

@Component({
  imports: [UcAnchor],
  template: `
    <a ucAnchor href="/billing" [variant]="variant()" [disabled]="disabled()" (click)="onClick()">
      Go to billing
    </a>
  `,
})
class UcAnchorHost {
  readonly variant = signal<'primary' | 'error'>('primary');
  readonly disabled = signal(false);
  clicks = 0;

  onClick(): void {
    this.clicks++;
  }
}

@Component({
  imports: [UcAnchor],
  template: `<a ucAnchor>No href</a>`,
})
class UcAnchorWithoutHrefHost {}

describe('UcAnchor', () => {
  let fixture: ComponentFixture<UcAnchorHost>;
  const anchor = (): HTMLAnchorElement => fixture.nativeElement.querySelector('a');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcAnchorHost, UcAnchorWithoutHrefHost] }).compileComponents();
    fixture = TestBed.createComponent(UcAnchorHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(anchor()).toBeTruthy();
  });

  it('should default to the primary variant', () => {
    expect(anchor().classList.contains('uc-primary')).toBe(true);
  });

  it('should apply the variant class', () => {
    fixture.componentInstance.variant.set('error');
    fixture.detectChanges();

    expect(anchor().classList.contains('uc-error')).toBe(true);
  });

  it('should not enable transitions in the render that applies the variant class', () => {
    const variantFixture = TestBed.createComponent(UcAnchorHost);
    variantFixture.componentInstance.variant.set('error');
    variantFixture.detectChanges();

    const errorAnchor: HTMLAnchorElement = variantFixture.nativeElement.querySelector('a');
    expect(errorAnchor.classList.contains('uc-error')).toBe(true);
    expect(errorAnchor.classList.contains('uc-transitions')).toBe(false);
  });

  it('should keep the href it was written with', () => {
    expect(anchor().getAttribute('href')).toBe('/billing');
  });

  it('should remove href, mark itself disabled, and stay in the tab order when disabled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const element = anchor();
    expect(element.hasAttribute('href')).toBe(false);
    expect(element.getAttribute('aria-disabled')).toBe('true');
    expect(element.getAttribute('role')).toBe('link');
    expect(element.getAttribute('tabindex')).toBe('0');
    expect(element.classList.contains('uc-disabled')).toBe(true);
  });

  it('should restore the original href once re-enabled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();

    expect(anchor().getAttribute('href')).toBe('/billing');
  });

  it('should not have aria-disabled, role or tabindex when enabled', () => {
    const element = anchor();
    expect(element.hasAttribute('aria-disabled')).toBe(false);
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.hasAttribute('tabindex')).toBe(false);
  });

  it('should still let a (click) handler on the element run while disabled, since this only removes href', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    anchor().dispatchEvent(new MouseEvent('click', { cancelable: true }));

    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('should let a click through when enabled', () => {
    anchor().dispatchEvent(new MouseEvent('click', { cancelable: true }));

    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('should stay without href when the anchor was written without one', () => {
    const noHrefFixture = TestBed.createComponent(UcAnchorWithoutHrefHost);
    noHrefFixture.detectChanges();

    const element: HTMLAnchorElement = noHrefFixture.nativeElement.querySelector('a');
    expect(element.hasAttribute('href')).toBe(false);
  });
});
