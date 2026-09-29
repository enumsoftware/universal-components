import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, DestroyRef, Directive, ElementRef, inject, signal } from '@angular/core';

/**
 * Angular's NgOptimizedImage with a fade-in once the image has loaded, so it appears smoothly
 * instead of painting in pieces while it downloads:
 *
 * ```html
 * <img ucOptimizedImage ngSrc="/photos/harbour.jpg" width="800" height="533" alt="The old harbour" />
 * ```
 *
 * Every NgOptimizedImage input works the same way, and `width` and `height` (or `fill`) still reserve
 * the space up front, so nothing around the image moves when it arrives. The fade is skipped when
 * it would do harm:
 * - `priority` images show at once: they are usually the largest image on the page, and a browser
 *   does not count an image as painted while it is transparent, which would delay that measurement.
 * - `placeholder` images keep NgOptimizedImage's own behaviour: the blurred placeholder is drawn on
 *   the image itself, and fading the image would hide it.
 * - With reduced motion requested, the image appears without animating.
 */
@Directive({
  selector: 'img[ucOptimizedImage]',
  hostDirectives: [
    {
      directive: NgOptimizedImage,
      inputs: [
        'ngSrc',
        'ngSrcset',
        'sizes',
        'width',
        'height',
        'decoding',
        'loading',
        'priority',
        'loaderParams',
        'disableOptimizedSrcset',
        'fill',
        'placeholder',
        'placeholderConfig',
      ],
    },
  ],
  host: {
    class: 'uc-optimized-image',
    '[class.uc-optimized-image--loaded]': 'loaded()',
    '[style.opacity]': 'fades() && !loaded() ? 0 : null',
    // Only the way in animates. A new ngSrc hides the old picture at once: a fade out would be cut
    // short and reversed by a fast load, so the new picture would never visibly fade in.
    '[style.transition]': 'fades() && loaded() ? transition : null',
    // An image that fails to load is shown as well, so its alt text is not left invisible.
    '(load)': 'loaded.set(true)',
    '(error)': 'loaded.set(true)',
  },
})
export class UcOptimizedImage {
  private readonly image = inject(NgOptimizedImage);
  private readonly reducedMotion = signal(
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  protected readonly loaded = signal(false);
  protected readonly transition =
    'opacity var(--uc-optimized-image-duration, 0.4s) var(--uc-optimized-image-easing, ease-out)';

  constructor() {
    const element = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;

    // A cached or server-rendered image can finish before the (load) listener is attached, and
    // would then stay transparent.
    afterNextRender(() => {
      if (element.complete && element.naturalWidth > 0) {
        this.loaded.set(true);
      }
    });

    // A new ngSrc on the same element, such as the next photo in a carousel, fades in again rather
    // than appearing all at once. NgOptimizedImage sets it as the src attribute.
    if (typeof MutationObserver === 'function') {
      const observer = new MutationObserver(() => this.loaded.set(element.complete && element.naturalWidth > 0));
      observer.observe(element, { attributes: true, attributeFilter: ['src'] });
      inject(DestroyRef).onDestroy(() => observer.disconnect());
    }
  }

  /** A method rather than computed(): NgOptimizedImage keeps its inputs as plain fields, not signals. */
  protected fades(): boolean {
    return !this.reducedMotion() && !this.image.priority && !this.image.placeholder;
  }
}
