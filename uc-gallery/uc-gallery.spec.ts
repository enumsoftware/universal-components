import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UcGallery, type UcGalleryImage } from './uc-gallery';

const IMAGES: UcGalleryImage[] = [
  { url: 'one.jpg', alt: 'First' },
  { url: 'two.jpg', alt: 'Second' },
  { url: 'three.jpg', alt: 'Third' },
];

describe('UcGallery', () => {
  let fixture: ComponentFixture<UcGallery>;
  let component: UcGallery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UcGallery] }).compileComponents();

    fixture = TestBed.createComponent(UcGallery);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', IMAGES);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    dialog.showModal ??= function (this: HTMLDialogElement) {
      this.open = true;
    };
    dialog.close ??= function (this: HTMLDialogElement) {
      this.open = false;
    };
  });

  it('renders a thumbnail button per image', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.uc-gallery__thumbnail');

    expect(buttons).toHaveLength(3);
    expect(buttons[1].getAttribute('aria-label')).toBe('Open image 2 of 3');
  });

  it('wraps around when moving past the last image', () => {
    component.open(2);
    component.next();
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.uc-gallery__image') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('one.jpg');
  });

  it('wraps around when moving before the first image', () => {
    component.open(0);
    component.previous();
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.uc-gallery__image') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('three.jpg');
  });
});
