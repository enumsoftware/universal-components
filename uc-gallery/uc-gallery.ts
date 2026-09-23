import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

export interface UcGalleryImage {
  url: string;
  alt: string;
  thumbnailUrl?: string;
}

/**
 * Thumbnail grid with a lightbox. The lightbox is a native modal `<dialog>`, so focus is trapped
 * and Escape closes it; arrow keys move between images.
 */
@Component({
  selector: 'uc-gallery',
  templateUrl: './uc-gallery.html',
  styleUrl: './uc-gallery.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class UcGallery {
  images = input<readonly UcGalleryImage[]>([]);
  openLabel = input<string>('Open image {index} of {count}');
  closeLabel = input<string>('Close');
  previousLabel = input<string>('Previous image');
  nextLabel = input<string>('Next image');

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly activeIndex = signal(0);
  protected readonly activeImage = computed<UcGalleryImage | undefined>(() => this.images()[this.activeIndex()]);
  protected readonly hasMany = computed<boolean>(() => this.images().length > 1);

  open(index: number): void {
    this.activeIndex.set(index);
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  previous(): void {
    const count = this.images().length;
    this.activeIndex.update((index) => (index - 1 + count) % count);
  }

  next(): void {
    this.activeIndex.update((index) => (index + 1) % this.images().length);
  }

  protected thumbnailLabel(index: number): string {
    return this.openLabel()
      .replace('{index}', String(index + 1))
      .replace('{count}', String(this.images().length));
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
