import { Component, input, signal } from '@angular/core';

import { UcButton } from '../../uc-button/uc-button';
import { UcOptimizedImage } from '../uc-optimized-image';

const PHOTOS = [
  { name: 'harbour', alt: 'A harbour at dawn' },
  { name: 'hills', alt: 'Green hills' },
  { name: 'sunset', alt: 'A sunset over the sea' },
];

/**
 * "Load again" gives every image a new URL, so it is created and loaded afresh and the fade can be
 * watched again. The sample photos are served by the workbench from workbench/public.
 */
@Component({
  selector: 'uc-optimized-image-preview',
  imports: [UcButton, UcOptimizedImage],
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .photos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
      gap: 1rem;
      width: 100%;
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 0.75rem;
      background: var(--uc-background-color-90);
    }
  `,
  template: `
    <uc-button text="Load again" variant="secondary" size="small" (clicked)="reload.update((n) => n + 1)" />
    <div class="photos" [style.--uc-optimized-image-duration]="duration()">
      @for (photo of photos; track photo.name + reload()) {
        <img
          ucOptimizedImage
          [ngSrc]="'sample-photos/' + photo.name + '.svg?load=' + reload()"
          width="800"
          height="533"
          [priority]="priority()"
          [alt]="photo.alt"
        />
      }
    </div>
  `,
})
export class OptimizedImagePreview {
  /** Any CSS time, such as 0.4s or 800ms. */
  readonly duration = input<string>('0.4s');
  readonly priority = input<boolean>(false);

  protected readonly photos = PHOTOS;
  protected readonly reload = signal(0);
}
