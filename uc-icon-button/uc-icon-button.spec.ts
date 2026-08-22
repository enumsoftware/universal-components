import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcIconButton } from './uc-icon-button';

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

  it('should not render an empty title when no label is provided', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.hasAttribute('title')).toBe(false);
    expect(button.hasAttribute('aria-label')).toBe(false);
  });
});
