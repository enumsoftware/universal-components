import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcTooltip, provideUcTooltipConfig } from './uc-tooltip';

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
});
