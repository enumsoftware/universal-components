import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcTooltip } from '../uc-tooltip/uc-tooltip';
import { UcIconButton } from './uc-icon-button';

@Component({
  imports: [UcIconButton, UcTooltip],
  template: `<uc-icon-button label="Clear filters" phosphorIcon="x" [ucTooltip]="'Clear filters'" />`,
})
class UcIconButtonTooltipHost {}

describe('UcIconButton with ucTooltip', () => {
  it('should leave out the native title, so only the tooltip shows, and keep the accessible name', () => {
    const fixture = TestBed.createComponent(UcIconButtonTooltipHost);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('title')).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Clear filters');
  });
});

@Component({
  imports: [UcIconButton],
  template: `
    <uc-icon-button label="Custom"><svg class="custom-icon"></svg></uc-icon-button>
    <uc-icon-button label="Phosphor" phosphorIcon="pencil"><svg class="custom-icon"></svg></uc-icon-button>
  `,
})
class UcIconButtonProjectionHost {}

describe('UcIconButton content projection', () => {
  it('should render projected content as the icon when phosphorIcon is empty', () => {
    const fixture = TestBed.createComponent(UcIconButtonProjectionHost);
    fixture.detectChanges();

    const [custom, phosphor] = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

    expect(custom.querySelector('svg.custom-icon')).not.toBeNull();
    expect(phosphor.querySelector('svg.custom-icon')).toBeNull();
    expect(phosphor.querySelector('i.ph-pencil')).not.toBeNull();
  });
});

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

  it('should render the icon variant with the uc-icon class', () => {
    fixture.componentRef.setInput('variant', 'icon');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.classList.contains('uc-icon')).toBe(true);
  });

  it('should expose an accessible name when label is provided', () => {
    fixture.componentRef.setInput('label', 'Edit item');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-label')).toBe('Edit item');
    expect(button.getAttribute('title')).toBe('Edit item');
  });

  it('should stay a plain action button until pressed is set', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.hasAttribute('aria-pressed')).toBe(false);
    expect(button.classList.contains('uc-image-button--pressed')).toBe(false);

    button.click();
    fixture.detectChanges();

    expect(component.pressed()).toBeNull();
    expect(button.hasAttribute('aria-pressed')).toBe(false);
  });

  it('should expose the toggle state once pressed is bound', () => {
    fixture.componentRef.setInput('pressed', false);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.classList.contains('uc-image-button--pressed')).toBe(false);

    fixture.componentRef.setInput('pressed', true);
    fixture.detectChanges();

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.classList.contains('uc-image-button--pressed')).toBe(true);
  });

  it('should flip its own state and still emit clicked when it is a toggle', () => {
    fixture.componentRef.setInput('pressed', false);
    fixture.detectChanges();

    let clicks = 0;
    component.clicked.subscribe(() => (clicks += 1));

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(component.pressed()).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(clicks).toBe(1);
  });

  it('should not flip while disabled', () => {
    fixture.componentRef.setInput('pressed', false);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let clicks = 0;
    component.clicked.subscribe(() => (clicks += 1));

    component.onClick(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.pressed()).toBe(false);
    expect(clicks).toBe(0);
  });

  it('should expose aria-expanded and aria-controls only when set', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('aria-expanded')).toBe(false);
    expect(button.hasAttribute('aria-controls')).toBe(false);

    fixture.componentRef.setInput('ariaExpanded', false);
    fixture.componentRef.setInput('ariaControls', 'panel');
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe('panel');
  });

  it('should not render an empty title when no label is provided', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.hasAttribute('title')).toBe(false);
    expect(button.hasAttribute('aria-label')).toBe(false);
  });
});
