import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UcButton } from './uc-button';

@Component({
  selector: 'uc-button-timing-host',
  imports: [UcButton],
  template: `<uc-button [text]="'Delete'" [variant]="'error'" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class Host {}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

describe('UcButton class timing', () => {
  it('has no live transition in the frame the variant class is applied', async () => {
    const fixture = TestBed.createComponent(Host);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    console.warn('AT_CREATION:[' + button.className + ']');

    fixture.detectChanges();

    console.warn('AFTER_CD:[' + button.className + ']');
    console.warn('AFTER_CD_TRANSITION:[' + getComputedStyle(button).transitionDuration + ']');

    expect(button.className).toContain('uc-error');
    expect(button.classList.contains('uc-transitions')).toBe(false);

    await fixture.whenStable();
    await nextFrame();
    await nextFrame();
    fixture.detectChanges();

    console.warn('LATER:[' + button.className + ']');
    console.warn('LATER_TRANSITION:[' + getComputedStyle(button).transitionDuration + ']');

    expect(button.classList.contains('uc-transitions')).toBe(true);
  });
});
