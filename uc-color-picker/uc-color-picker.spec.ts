import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcColorPicker } from './uc-color-picker';

describe('UcColorPicker', () => {
  let component: UcColorPicker;
  let fixture: ComponentFixture<UcColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcColorPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(UcColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function valueInput(): HTMLInputElement {
    component.openDropdown();
    fixture.detectChanges();
    return document.querySelector('.uc-color-picker__value-input') as HTMLInputElement;
  }

  function type(input: HTMLInputElement, text: string): void {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('updates the preview as soon as a typed colour is complete, and follows its format', () => {
    const input = valueInput();

    type(input, 'rgb(0, 128');
    expect(component.draftValue()).toBe('#ff0000');

    type(input, 'rgb(0, 128, 255)');
    expect(component.draftValue()).toBe('#0080ff');
    expect(component.colorFormat()).toBe('rgb');
    expect(input.value).toBe('rgb(0, 128, 255)');
  });

  it('marks text that is not a colour as invalid, and shows the colour again on blur', () => {
    const input = valueInput();

    type(input, 'not a colour');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.value).toBe('#FF0000');
  });

  it('saves on Enter when the typed colour is valid', () => {
    const input = valueInput();

    type(input, '#00ff00');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(component.value()).toBe('#00ff00');
    expect(component.isOpen()).toBe(false);
  });

  it('takes a colour pasted anywhere in the open panel', () => {
    valueInput();
    let prevented = false;

    component.onPanelPaste({
      target: document.body,
      clipboardData: { getData: () => 'hsl(240, 100%, 50%)' },
      preventDefault: () => (prevented = true),
    } as unknown as ClipboardEvent);

    expect(component.draftValue()).toBe('#0000ff');
    expect(component.colorFormat()).toBe('hsl');
    expect(prevented).toBe(true);
  });
});
