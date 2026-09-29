import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UcOptimizedImage } from './uc-optimized-image';

@Component({
  imports: [UcOptimizedImage],
  template: `
    <img ucOptimizedImage [ngSrc]="src()" width="800" height="533" alt="The old harbour" [priority]="priority()" />
  `,
})
class UcOptimizedImageHost {
  readonly priority = signal(false);
  readonly src = signal('/photos/harbour.jpg');
}

describe('UcOptimizedImage', () => {
  let fixture: ComponentFixture<UcOptimizedImageHost>;
  const image = (): HTMLImageElement => fixture.nativeElement.querySelector('img');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcOptimizedImageHost] }).compileComponents();
    fixture = TestBed.createComponent(UcOptimizedImageHost);
  });

  it('applies NgOptimizedImage: the image gets its src and reserved size', async () => {
    await fixture.whenStable();

    expect(image().getAttribute('src')).toBe('/photos/harbour.jpg');
    expect(image().getAttribute('width')).toBe('800');
    expect(image().getAttribute('height')).toBe('533');
  });

  it('stays transparent until the image has loaded, then fades in', async () => {
    await fixture.whenStable();
    // Hidden without a transition: only the way in animates.
    expect(image().style.opacity).toBe('0');
    expect(image().style.transition).toBe('');

    image().dispatchEvent(new Event('load'));
    await fixture.whenStable();

    expect(image().style.opacity).toBe('');
    expect(image().style.transition).toContain('opacity');
    expect(image().classList).toContain('uc-optimized-image--loaded');
  });

  it('shows an image that failed to load, so its alt text is visible', async () => {
    await fixture.whenStable();

    image().dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(image().style.opacity).toBe('');
  });

  it('fades in again when the same image gets a new ngSrc', async () => {
    await fixture.whenStable();
    image().dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(image().style.opacity).toBe('');

    fixture.componentInstance.src.set('/photos/hills.jpg');
    await fixture.whenStable();
    expect(image().getAttribute('src')).toBe('/photos/hills.jpg');
    expect(image().style.opacity).toBe('0');
    // The old picture is hidden at once rather than faded out, so a fast load still fades in.
    expect(image().style.transition).toBe('');

    image().dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(image().style.opacity).toBe('');
  });

  it('shows priority images at once, without a fade', async () => {
    fixture.componentInstance.priority.set(true);
    await fixture.whenStable();

    expect(image().style.opacity).toBe('');
    expect(image().style.transition).toBe('');
  });
});
