import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcTooltip, provideUcTooltipConfig } from './uc-tooltip';

/** A host with a focusable element inside, like uc-icon-button. */
@Component({ selector: 'uc-test-wrapper', template: `<button type="button">Inner</button>` })
class WrapperComponent {}

@Component({
  imports: [UcTooltip, WrapperComponent],
  template: `
    <uc-test-wrapper [ucTooltip]="'On a component'" />
    <span class="plain" [ucTooltip]="'On a span'">i</span>
  `,
})
class FocusHostComponent {}

@Component({
  imports: [UcTooltip],
  template: `<button [ucTooltip]="'Tooltip text'">Hover</button>`,
})
class TestHostComponent {}

@Component({
  imports: [UcTooltip],
  template: `<button [ucTooltip]="'Tooltip text'" [ucTooltipPosition]="'top'" [ucTooltipMargin]="'16px'">
    Hover
  </button>`,
})
class OverrideHostComponent {}

describe('UcTooltip', () => {
  it('should create an instance', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement).toBeTruthy();
  });

  it('should show and hide the tooltip overlay using the default global config', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const directive = fixture.debugElement.children[0].injector.get(UcTooltip);

    buttonElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(document.querySelector('.uc-tooltip')).toBeTruthy();

    directive.hide();
    fixture.detectChanges();
    expect(document.querySelector('.uc-tooltip')).toBeFalsy();
  });

  it('should allow per-instance position and margin overrides', () => {
    TestBed.configureTestingModule({
      imports: [OverrideHostComponent],
    });

    const fixture = TestBed.createComponent(OverrideHostComponent);
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    buttonElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.uc-tooltip')).toBeTruthy();
  });

  it('should allow overriding the global config via provideUcTooltipConfig', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideUcTooltipConfig({ position: 'top', margin: '4px' })],
    });

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    buttonElement.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    expect(document.querySelector('.uc-tooltip')).toBeTruthy();
  });

  it('should add no tab stop to a host that already contains a focusable element', async () => {
    TestBed.configureTestingModule({ imports: [FocusHostComponent] });
    const fixture = TestBed.createComponent(FocusHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const wrapper: HTMLElement = fixture.nativeElement.querySelector('uc-test-wrapper');
    const span: HTMLElement = fixture.nativeElement.querySelector('.plain');
    expect(wrapper.hasAttribute('tabindex')).toBe(false);
    expect(span.getAttribute('tabindex')).toBe('0');
  });

  it('should show when a focusable element inside the host gets focus', () => {
    TestBed.configureTestingModule({ imports: [FocusHostComponent] });
    const fixture = TestBed.createComponent(FocusHostComponent);
    fixture.detectChanges();

    const inner: HTMLButtonElement = fixture.nativeElement.querySelector('uc-test-wrapper button');
    inner.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    expect(document.querySelector('.uc-tooltip')?.textContent).toContain('On a component');

    inner.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    expect(document.querySelector('.uc-tooltip')).toBeFalsy();
  });
});
