import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcToggle } from './uc-toggle';

describe('UcToggle', () => {
  let component: UcToggle;
  let fixture: ComponentFixture<UcToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcToggle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const switchElement = (): HTMLElement => fixture.nativeElement.querySelector('[role="switch"]');

  it('should be a focusable switch that reports its state', () => {
    expect(switchElement().getAttribute('aria-checked')).toBe('false');
    expect(switchElement().getAttribute('tabindex')).toBe('0');

    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(switchElement().getAttribute('aria-checked')).toBe('true');
  });

  it('should toggle with Space and Enter', () => {
    switchElement().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();
    expect(component.checked()).toBe(true);

    switchElement().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(component.checked()).toBe(false);
  });

  it('should take its name from a label or visible text', () => {
    fixture.componentRef.setInput('ariaLabelledby', 'row-label');
    fixture.componentRef.setInput('id', 'email-switch');
    fixture.detectChanges();
    expect(switchElement().getAttribute('aria-labelledby')).toBe('row-label');
    expect(switchElement().id).toBe('email-switch');
  });

  it('should not toggle or be reachable while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    switchElement().click();
    switchElement().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();
    expect(component.checked()).toBe(false);
    expect(switchElement().getAttribute('tabindex')).toBe('-1');
    expect(switchElement().getAttribute('aria-disabled')).toBe('true');
  });
});
