import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcButton } from './uc-button';

describe('UcButton', () => {
  let component: UcButton;
  let fixture: ComponentFixture<UcButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UcButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UcButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Submit');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to medium size', () => {
    expect(component.size()).toBe('medium');
  });

  it('should apply small size class', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('uc-size-small')).toBe(true);
  });

  it('should not enable transitions in the render that applies the variant class', () => {
    const variantFixture = TestBed.createComponent(UcButton);
    variantFixture.componentRef.setInput('text', 'Delete');
    variantFixture.componentRef.setInput('variant', 'error');
    variantFixture.detectChanges();

    const button = variantFixture.nativeElement.querySelector('button');
    expect(button.classList.contains('uc-error')).toBe(true);
    expect(button.classList.contains('uc-transitions')).toBe(false);
  });

  it('should not render a spinner when it is not loading', () => {
    expect(fixture.nativeElement.querySelector('uc-spinner-loading')).toBeNull();
    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-busy')).toBe('false');
  });

  it('should render a spinner and mark itself busy while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('uc-loading')).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(fixture.nativeElement.querySelector('uc-spinner-loading')).not.toBeNull();
  });

  it('should keep the label in the DOM while loading so the width does not collapse', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.uc-button-content');
    expect(content).not.toBeNull();
    expect(content.textContent).toContain('Submit');
  });

  it('should stay focusable while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(false);
  });

  it('should still disable natively when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('should not emit clicked while loading', () => {
    const emitted: void[] = [];
    component.clicked.subscribe(() => emitted.push(undefined));

    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(emitted.length).toBe(0);
  });

  it('should emit clicked once loading finishes', () => {
    const emitted: void[] = [];
    component.clicked.subscribe(() => emitted.push(undefined));

    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();

    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();

    expect(emitted.length).toBe(1);
  });

  it('should render loadingText and swap the resting label', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingText', 'Saving…');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('uc-loading-labeled')).toBe(true);
    expect(fixture.nativeElement.querySelector('.uc-button-loading-text').textContent).toContain(
      'Saving…',
    );
  });

  it('should not mark itself labeled when loadingText is unset', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('uc-loading-labeled')).toBe(false);
    expect(fixture.nativeElement.querySelector('.uc-button-loading-text')).toBeNull();
  });

  it('should enable transitions after the first paint', async () => {
    await fixture.whenStable();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('uc-transitions')).toBe(true);
  });
});
