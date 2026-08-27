import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcSelect } from './uc-select';

describe('UcSelect', () => {
  let component: UcSelect<string>;
  let fixture: ComponentFixture<UcSelect<string>>;

  const panel = () => document.querySelector<HTMLElement>('.uc-select-panel');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcSelect],
    }).compileComponents();

    fixture = TestBed.createComponent<UcSelect<string>>(UcSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'select-1');
    fixture.detectChanges();
  });

  afterEach(() => {
    component.closeDropdown();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label when provided and hideLabel is false', () => {
    fixture.componentRef.setInput('label', 'Country');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label.uc-select-label');
    const trigger = fixture.nativeElement.querySelector('.uc-select-trigger');

    expect(label?.textContent).toContain('Country');
    expect(label?.id).toBe('select-1-label');
    expect(trigger.getAttribute('aria-labelledby')).toBe('select-1-label');
    expect(trigger.getAttribute('aria-label')).toBeNull();
  });

  it('should name the trigger from the label when hideLabel is true', () => {
    fixture.componentRef.setInput('label', 'Country');
    fixture.componentRef.setInput('hideLabel', true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.uc-select-trigger');

    expect(fixture.nativeElement.querySelector('label.uc-select-label')).toBeFalsy();
    expect(trigger.getAttribute('aria-label')).toBe('Country');
    expect(trigger.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should fall back to the placeholder when there is no label at all', () => {
    fixture.componentRef.setInput('placeholder', 'Select a country');
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.uc-select-trigger');

    expect(trigger.getAttribute('aria-label')).toBe('Select a country');
    expect(trigger.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should render the panel in the overlay container rather than inside the host', () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }]);
    component.openDropdown();
    fixture.detectChanges();

    const rendered = panel();

    expect(rendered).toBeTruthy();
    expect(fixture.nativeElement.contains(rendered)).toBe(false);
    expect(rendered?.closest('.cdk-overlay-pane')).toBeTruthy();
  });

  it('should offer an above-the-trigger fallback so the panel can flip when space is short', () => {
    const flipped = component.panelPositions.filter((position) => position.overlayY === 'bottom');

    expect(component.panelPositions[0].originY).toBe('bottom');
    expect(component.panelPositions[0].overlayY).toBe('top');
    expect(flipped.length).toBeGreaterThan(0);
  });

  it('should cap the panel height to the space available around the trigger', () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }]);
    component.openDropdown();
    fixture.detectChanges();

    const maxHeight = Number.parseFloat(component.panelStyle()['max-height']);

    expect(maxHeight).toBeGreaterThan(0);
    expect(maxHeight).toBeLessThanOrEqual(window.innerHeight);
    expect(panel()?.style.maxHeight).toBe(component.panelStyle()['max-height']);
  });

  it('should carry host-scoped theming into the overlay panel', () => {
    const host: HTMLElement = fixture.nativeElement;
    host.style.setProperty('--uc-select-option-padding', '0.45rem 0.75rem');
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }]);

    component.openDropdown();
    fixture.detectChanges();

    expect(component.panelStyle()['--uc-select-option-padding']).toBe('0.45rem 0.75rem');
    expect(panel()?.style.getPropertyValue('--uc-select-option-padding').trim()).toBe(
      '0.45rem 0.75rem',
    );
  });

  it('should not open while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    component.toggleDropdown();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
    expect(panel()).toBeNull();
  });

  it('should close on Escape', () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }]);
    component.openDropdown();
    fixture.detectChanges();

    component.onOverlayKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
    expect(panel()).toBeNull();
  });

  it('should keep the panel open when the trigger blurs, so a click can land on an option', () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }]);
    component.openDropdown();
    fixture.detectChanges();

    component.onBlur();
    fixture.detectChanges();

    expect(component.touched()).toBe(true);
    expect(component.isOpen()).toBe(true);
  });
});
